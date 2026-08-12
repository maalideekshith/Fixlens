import asyncio
import base64
import json
from pathlib import Path
from unittest import result

import httpx

from app.core.config import settings


OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


# ---------------------------------------------------------
# MODELS
# ---------------------------------------------------------

TEXT_MODELS = [
    settings.LLM_MODEL,
    "google/gemma-4-26b-a4b-it:free",
    "google/gemma-4-31b-it:free",
    "openai/gpt-oss-20b:free",
]

TEXT_MODELS = list(dict.fromkeys(TEXT_MODELS))

# OpenRouter free router can select a vision-capable
# free model automatically.
VISION_MODEL = "openrouter/free"


# ---------------------------------------------------------
# OPENROUTER REQUEST
# ---------------------------------------------------------

async def _call_openrouter(
    client: httpx.AsyncClient,
    model: str,
    messages: list,
) -> str:
    """
    Send a request to OpenRouter.

    Supports:
    - text-only messages
    - multimodal messages containing images
    """

    headers = {
        "Authorization": f"Bearer {settings.LLM_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "FixLens",
    }

    payload = {
        "model": model,
        "messages": messages,
        "temperature": 0.2,
        "max_tokens": 1800,
    }

    response = await client.post(
        OPENROUTER_URL,
        headers=headers,
        json=payload,
    )

    if response.status_code != 200:
        print(
            f"OpenRouter error status: "
            f"{response.status_code}"
        )
        print(
            f"OpenRouter error response: "
            f"{response.text}"
        )

    response.raise_for_status()

    data = response.json()

    try:
        return data["choices"][0]["message"]["content"]

    except (
        KeyError,
        IndexError,
        TypeError,
    ) as error:

        raise RuntimeError(
            "Unexpected OpenRouter response: "
            f"{json.dumps(data, indent=2)}"
        ) from error


# ---------------------------------------------------------
# JSON PARSER
# ---------------------------------------------------------

def _parse_ai_response(result: str) -> dict:
    """
    Parse JSON returned by the AI.

    Handles:
    - normal JSON
    - ```json ... ``` responses
    - extra whitespace
    """

    cleaned = result.strip()

    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]

    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]

    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]

    cleaned = cleaned.strip()

    try:

        parsed = json.loads(cleaned)

        if isinstance(parsed, dict):
            return parsed

        return {
            "raw_analysis": result,
        }

    except json.JSONDecodeError:

        return {
            "raw_analysis": result,
        }


# ---------------------------------------------------------
# BUILD PROMPT
# ---------------------------------------------------------

def _build_prompt(
    title: str,
    description: str,
    expected_behavior: str,
    actual_behavior: str,
    steps_to_reproduce: str,
    has_screenshot: bool,
) -> str:

    screenshot_instruction = ""

    if has_screenshot:

        screenshot_instruction = """
A screenshot of the bug is attached.

VISUAL ANALYSIS REQUIREMENTS:

- Carefully inspect the entire screenshot.
- Identify visible error messages.
- Identify visible HTTP status codes.
- Identify validation errors.
- Identify broken buttons, forms, fields, layouts,
  or UI states.
- Identify visible console-like or system errors.
- Identify incorrect values or unexpected states.
- Use the screenshot as direct evidence.
- Do not invent information that is not visible.
- Explain what the screenshot proves separately from
  what is only suspected.
"""

    return f"""
You are FixLens, an expert software debugging assistant.

Analyze the following software bug using ALL available
information.

BUG TITLE:
{title}

DESCRIPTION:
{description}

EXPECTED BEHAVIOR:
{expected_behavior}

ACTUAL BEHAVIOR:
{actual_behavior}

STEPS TO REPRODUCE:
{steps_to_reproduce}

{screenshot_instruction}

Your analysis must be specific and useful to a developer.

IMPORTANT:

1. Carefully analyze the written bug information.
2. Carefully inspect the screenshot if provided.
3. Use visible screenshot evidence when available.
4. Do not invent error messages, API responses,
   database errors, or technical causes.
5. Clearly distinguish evidence from assumptions.
6. Do not simply repeat the bug description.
7. Give a technically meaningful probable cause.
8. Give concrete developer-oriented fixes.
9. Severity must represent the impact of the bug.
10. Priority must represent how urgently it should be fixed.
11. Confidence must represent how strongly the available
    evidence supports the diagnosis.
12. Visual evidence should describe what is actually visible
    in the screenshot.
13. Reproduction steps should be realistic and based on
    the supplied information.

Return ONLY valid JSON.

Use EXACTLY this structure:

{{
    "summary": "Concise explanation of what is actually going wrong.",

    "visual_evidence": "Specific evidence visible in the screenshot. If no screenshot is available, return 'No screenshot provided.'",

    "probable_cause": "Most likely technical root cause based on the available evidence. Clearly indicate uncertainty when the exact cause cannot be confirmed.",

    "suggested_fix": "Specific and actionable technical steps a developer should take to investigate and fix the issue.",

    "reproduction_steps": [
        "Step 1",
        "Step 2",
        "Step 3"
    ],

    "severity": "Low | Medium | High | Critical",

    "priority": "Low | Medium | High | Critical",

    "confidence": 85
}}

CONFIDENCE RULE:

Return confidence as an integer from 0 to 100.

Examples:

95 = strong direct evidence

80 = strong evidence but some uncertainty

60 = reasonable diagnosis with limited evidence

40 = mostly inferred

20 = very uncertain

JSON RULES:

- Return valid JSON only.
- Do not use Markdown.
- Do not wrap the JSON in ```json.
- Do not add explanations outside the JSON.
- Do not create additional fields.
"""


# ---------------------------------------------------------
# IMAGE HELPERS
# ---------------------------------------------------------

def _get_image_data_url(
    screenshot_url: str,
) -> str:
    """
    Convert a locally stored screenshot into a base64
    data URL.

    Example:
        /uploads/bug_4.png
    """

    relative_path = screenshot_url.lstrip("/")

    file_path = Path(relative_path)

    if not file_path.exists():

        raise FileNotFoundError(
            f"Screenshot file not found: {file_path}"
        )

    image_bytes = file_path.read_bytes()

    extension = file_path.suffix.lower()

    mime_types = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
    }

    mime_type = mime_types.get(
        extension,
        "image/png",
    )

    encoded_image = base64.b64encode(
        image_bytes
    ).decode("utf-8")

    return (
        f"data:{mime_type};base64,{encoded_image}"
    )


# ---------------------------------------------------------
# MAIN ANALYSIS FUNCTION
# ---------------------------------------------------------

async def analyze_bug(
    title: str,
    description: str,
    expected_behavior: str,
    actual_behavior: str,
    steps_to_reproduce: str,
    screenshot_url: str | None = None,
):
    """
    Analyze a bug using an LLM through OpenRouter.

    If screenshot_url is provided:
        Uses a vision-capable model to analyze the
        screenshot together with the bug information.

    Otherwise:
        Uses normal text-only models.
    """

    if not settings.LLM_API_KEY:

        raise RuntimeError(
            "LLM_API_KEY is not configured. "
            "Add your OpenRouter API key to the .env file."
        )

    has_screenshot = bool(screenshot_url)

    prompt = _build_prompt(
        title=title,
        description=description,
        expected_behavior=expected_behavior,
        actual_behavior=actual_behavior,
        steps_to_reproduce=steps_to_reproduce,
        has_screenshot=has_screenshot,
    )

    timeout = httpx.Timeout(
        connect=10.0,
        read=90.0,
        write=30.0,
        pool=10.0,
    )

    async with httpx.AsyncClient(
        timeout=timeout
    ) as client:

        # -------------------------------------------------
        # SCREENSHOT ANALYSIS
        # -------------------------------------------------

        if has_screenshot:

            print(
                "Screenshot found. "
                "Sending bug screenshot to AI "
                "for visual analysis."
            )

            try:

                image_data_url = _get_image_data_url(
                    screenshot_url
                )

            except Exception as error:

                print(
                    f"Unable to load screenshot: "
                    f"{error}"
                )

                raise RuntimeError(
                    "The screenshot was saved, but FixLens "
                    "could not read the screenshot file."
                ) from error

            messages = [
                {
                    "role": "system",
                    "content": (
                        "You are FixLens, an expert "
                        "software debugging assistant. "
                        "You analyze software screenshots "
                        "and bug reports. "
                        "Use visible evidence carefully. "
                        "Do not invent information. "
                        "Return structured JSON only."
                    ),
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt,
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": image_data_url,
                            },
                        },
                    ],
                },
            ]

            try:

                print(
                    f"Trying OpenRouter vision model: "
                    f"{VISION_MODEL}"
                )

                result = await _call_openrouter(
                    client=client,
                    model=VISION_MODEL,
                    messages=messages,
                )
                print("VISION AI RAW RESULT:")
                print(result)


                print(
                    "OpenRouter vision analysis successful."
                )

                parsed = _parse_ai_response(result)

                print(
                    "AI vision analysis parsed successfully."
                )

                return parsed

            except httpx.HTTPStatusError as error:

                status_code = (
                    error.response.status_code
                )

                print(
                    f"Vision model failed with status "
                    f"{status_code}."
                )

                print(
                    f"Vision model response: "
                    f"{error.response.text}"
                )

                raise RuntimeError(
                    "The AI vision model could not "
                    "analyze the screenshot. "
                    "Please try again."
                ) from error

            except httpx.RequestError as error:

                print(
                    f"Network error during vision "
                    f"analysis: {error}"
                )

                raise RuntimeError(
                    "Unable to contact the AI service. "
                    "Please try again."
                ) from error

        # -------------------------------------------------
        # TEXT-ONLY ANALYSIS
        # -------------------------------------------------

        print(
            "No screenshot available. "
            "Running text-only bug analysis."
        )

        messages = [
            {
                "role": "system",
                "content": (
                    "You are FixLens, an expert "
                    "software debugging assistant. "
                    "Analyze software bugs clearly "
                    "and return structured JSON only."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ]

        last_error = None

        for model in TEXT_MODELS:

            print(
                f"Trying OpenRouter model: {model}"
            )

            for attempt in range(3):

                try:

                    result = await _call_openrouter(
                        client=client,
                        model=model,
                        messages=messages,
                    )

                    print(
                        f"OpenRouter success using model: "
                        f"{model}"
                    )

                    parsed = _parse_ai_response(
                        result
                    )

                    print(
                        "AI text analysis parsed "
                        "successfully."
                    )

                    return parsed

                except httpx.HTTPStatusError as error:

                    last_error = error

                    status_code = (
                        error.response.status_code
                    )

                    if status_code == 429:

                        retry_after = (
                            error.response.headers.get(
                                "Retry-After"
                            )
                        )

                        try:

                            wait_seconds = float(
                                retry_after
                            )

                        except (
                            TypeError,
                            ValueError,
                        ):

                            wait_seconds = 2.0

                        wait_seconds = min(
                            max(
                                wait_seconds,
                                1.0,
                            ),
                            10.0,
                        )

                        if attempt < 2:

                            print(
                                f"Model {model} is "
                                f"rate-limited. "
                                f"Retrying in "
                                f"{wait_seconds} seconds..."
                            )

                            await asyncio.sleep(
                                wait_seconds
                            )

                            continue

                        print(
                            f"Model {model} remained "
                            f"rate-limited."
                        )

                        break

                    if status_code == 404:

                        print(
                            f"Model {model} is unavailable. "
                            f"Trying next model."
                        )

                        break

                    print(
                        f"OpenRouter request failed "
                        f"with status {status_code}."
                    )

                    print(
                        f"Response: "
                        f"{error.response.text}"
                    )

                    break

                except httpx.RequestError as error:

                    last_error = error

                    print(
                        f"Network error while contacting "
                        f"OpenRouter: {error}"
                    )

                    if attempt < 2:

                        await asyncio.sleep(2)

                        continue

                    break

                except Exception as error:

                    last_error = error

                    print(
                        f"Unexpected error using "
                        f"{model}: {error}"
                    )

                    break

        # -------------------------------------------------
        # ALL TEXT MODELS FAILED
        # -------------------------------------------------

        if last_error is not None:

            if isinstance(
                last_error,
                httpx.HTTPStatusError,
            ):

                status_code = (
                    last_error.response.status_code
                )

                if status_code == 429:

                    raise RuntimeError(
                        "All configured OpenRouter "
                        "models are currently "
                        "rate-limited. Please try again."
                    )

                raise RuntimeError(
                    f"OpenRouter API request failed "
                    f"with status {status_code}: "
                    f"{last_error.response.text}"
                )

            raise RuntimeError(
                f"Unable to analyze bug using "
                f"OpenRouter: {last_error}"
            )

        raise RuntimeError(
            "Unable to analyze bug. "
            "No available LLM model responded."
        )