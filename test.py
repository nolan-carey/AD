import os
import requests
from dotenv import load_dotenv

load_dotenv()

ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY", "")

BASE_URL = "https://api.elevenlabs.io/v1"

HEADERS = {
    "xi-api-key": ELEVENLABS_API_KEY,
    "Content-Type": "application/json",
}


def check_api_access():
    """Hit /user endpoint to verify the API key works."""
    response = requests.get(f"{BASE_URL}/user", headers=HEADERS)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    return response


def list_voices():
    """List all available voices on the account."""
    response = requests.get(f"{BASE_URL}/voices", headers=HEADERS)
    print(f"Status: {response.status_code}")
    if response.ok:
        voices = response.json().get("voices", [])
        print(f"Found {len(voices)} voices:")
        for v in voices:
            print(f"  - {v.get('name')}  ({v.get('voice_id')})")
    else:
        print(f"Response: {response.text}")
    return response


def text_to_speech(text, voice_id, output_path="output.mp3"):
    """Generate speech and save to output_path."""
    url = f"{BASE_URL}/text-to-speech/{voice_id}"
    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75},
    }
    response = requests.post(url, headers=HEADERS, json=payload)
    print(f"Status: {response.status_code}")
    if response.ok:
        with open(output_path, "wb") as f:
            f.write(response.content)
        print(f"Saved audio to {output_path}")
    else:
        print(f"Response: {response.text}")
    return response


# ====================================================================
# Sound-effects pipeline (ad_plan.md §4.5.1)
# Source of truth: SFX_QUEUE below. Prompts are LOCKED — do not edit
# without Steve approval (see §4.5.6 gate).
# ====================================================================

def sound_effects(prompt: str, duration_seconds: float, output_path: str,
                  prompt_influence: float = 0.45) -> requests.Response:
    """Generate a single sound effect via ElevenLabs Sound Generation API.

    Args:
        prompt: descriptive text of the sound (locked from SFX_QUEUE — do not paraphrase)
        duration_seconds: 0.5–22.0 seconds
        output_path: destination .mp3 path
        prompt_influence: 0.0–1.0 — higher = stricter prompt adherence.
            We default to 0.45 (slightly above ElevenLabs default of 0.3) because
            our prompts are precise and we want generation to follow them tightly.
    """
    url = f"{BASE_URL}/sound-generation"
    payload = {
        "text": prompt,
        "duration_seconds": duration_seconds,
        "prompt_influence": prompt_influence,
    }
    response = requests.post(url, headers=HEADERS, json=payload)
    print(f"[{output_path}] status: {response.status_code}")
    if response.ok:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, "wb") as f:
            f.write(response.content)
        print(f"  ✓ saved {len(response.content)} bytes")
    else:
        print(f"  ✗ {response.text}")
    return response



SFX_QUEUE = [
    # ── P0: Atmospheric foundation (5) ──
    {"id": "phone_vibration_loop", "prompt": "Subtle low-frequency phone vibration buzz with soft mechanical motor rumble, as if a phone is face-down on a wooden truck dashboard. Constant rhythmic tremor, no melody, no music, designed to loop seamlessly with no audible start or end.", "duration": 6.0, "priority": "P0"},
    {"id": "counter_roll_money", "prompt": "Cinematic synth tone rising in pitch over 1.2 seconds like a slot-machine total settling, ending with a confident metallic chink and warm bloom. Modern analog synth, clean, premium SaaS, peaks decisively at the end. No music, no melody, single sustained tonal sweep.", "duration": 1.5, "priority": "P0"},
    {"id": "achievement_chime", "prompt": "Bright cheerful UI achievement chime, three quick ascending notes resolving on a major chord, like a successful task completion in a premium SaaS app. Modern, polished, glassy, not retro game-like, no reverb tail.", "duration": 1.0, "priority": "P0"},
    {"id": "ai_hum_ambient", "prompt": "Soft warm ambient hum with subtle high-frequency shimmer and barely perceptible synth pads, evoking futuristic AI processing in the background. Steady, no melody, no rhythm, calming but with quiet intelligence. Designed to loop seamlessly under voiceover.", "duration": 8.0, "priority": "P0"},
    {"id": "outro_drone", "prompt": "Ambient cinematic drone in C major, building from low warm sub-bass to bright open high frequencies over 4 seconds. Hopeful, premium, end-of-journey feel. No melody, single sustained chord opening up.", "duration": 5.0, "priority": "P0"},

    # ── P1: Bespoke UI moments (5) ──
    {"id": "iphone_morph_whirr", "prompt": "Soft mechanical whirr followed by a subtle thunk, like the home button mechanism of an iPhone or a precision camera shutter closing. Premium, brief, organic-mechanical, no music.", "duration": 0.6, "priority": "P1"},
    {"id": "scan_sweep", "prompt": "Smooth electronic scan sweep, low to high frequency over 0.8 seconds, like a receipt being scanned by a modern AI app. Subtle reverb tail, no harsh frequencies, no clicks.", "duration": 1.0, "priority": "P1"},
    {"id": "sparkle_match", "prompt": "Quick bright sparkle chime, two cascading notes, like a magical UI element snapping into the correct slot. Light, satisfying, AI-coded, glassy texture, no reverb tail.", "duration": 0.5, "priority": "P1"},
    {"id": "map_zoom_whoosh", "prompt": "Cinematic camera zoom whoosh from wide to close, low filtered noise sweep with a subtle Doppler shift. Used in modern map applications. No music, no clicks, smooth tail.", "duration": 0.8, "priority": "P1"},
    {"id": "route_line_flow", "prompt": "Subtle flowing electronic energy travelling along a path, like data moving through a network line. Soft synthetic stream, faint UI texture, no harsh elements, no melody.", "duration": 1.0, "priority": "P1"},

    # ── P2: Per-scene atmospheric beds (v1.11) — replace shared ai_hum_ambient as Scene 2–6 underbeds ──
    {"id": "bed_intimate_warm", "prompt": "Warm intimate ambient bed with soft purple-tinted texture and barely audible synth pad. Personal, close, no melody, no rhythm. Designed to loop seamlessly under voiceover or close-up UI moments. Suggests a quiet moment of focus.", "duration": 6.0, "priority": "P2"},
    {"id": "bed_precise_tense", "prompt": "Tense ambient bed with subtle rising pulse and clean digital texture. Building anticipation. Suggests precision work or AI calculation. Loops seamlessly. No melody, no music, mid-range warmth.", "duration": 8.0, "priority": "P2"},
    {"id": "bed_tactile_clinical", "prompt": "Clean clinical ambient bed with subtle electronic scanning texture and gentle warmth, like a modern receipt scanner or a methodical app process. Loops seamlessly. No melody.", "duration": 6.0, "priority": "P2"},
    {"id": "bed_spatial_cinematic", "prompt": "Spacious cinematic ambient bed with airy reverb and subtle distant pulse. Suggests open geography and movement, like driving through a city. Loops seamlessly. No melody, just texture.", "duration": 6.0, "priority": "P2"},
    {"id": "bed_conversational_warm", "prompt": "Friendly warm ambient bed with subtle communicative texture, like soft connectivity between people. Suggests messages flowing back and forth. Loops seamlessly. No melody, no rhythm.", "duration": 6.0, "priority": "P2"},

    # ── P3: Transition stings between scenes (v1.11) ──
    # ⚠️ NOTE: ElevenLabs Sound Generation API minimum duration is 0.5s. Two of the
    # locked durations below (0.4 and 0.3) are below that floor — those entries
    # WILL FAIL with HTTP 400 the same way `sparkle_match` does. They are kept
    # verbatim from §4.5.3 as the locked source of truth — Steve revises if needed.
    {"id": "transition_warm_whoosh", "prompt": "Warm filtered whoosh with subtle low-end thump, transitioning from intimate close-up to precise focus. No high frequencies, no harsh elements. Half a second total.", "duration": 0.5, "priority": "P3"},
    {"id": "transition_sharp_impact", "prompt": "Sharp clean impact with brief reverb tail, used as a scene transition between a precise quote moment and a tactile receipt-scanning scene. Premium, deliberate.", "duration": 0.5, "priority": "P3"},
    {"id": "transition_glitch_cut", "prompt": "Brief electronic glitch-cut transition with subtle digital texture, suggesting a switch in modality from list to map view. Modern, restrained, not chaotic. About half a second.", "duration": 0.5, "priority": "P3"},
    {"id": "transition_soft_fade", "prompt": "Soft warm fade transition with gentle high-frequency shimmer, suggesting connection and conversation, used between a map scene and a follow-up message scene. Warm.", "duration": 0.6, "priority": "P3"},
]


def generate_all(priority_filter: str | None = None,
                 output_dir: str = "Sound/generated",
                 force: bool = False) -> None:
    """Idempotent batch generator — skips files that already exist unless force=True.

    Cost-safe usage:
        generate_all(priority_filter="P0")   # 5 sounds, ~2,150 credits
        # — preview results, listen, decide —
        generate_all(priority_filter="P1")   # 5 more, ~480 credits

    Total expected first-pass spend: ~2,630 credits (under 5% of Creator monthly).
    """
    for sfx in SFX_QUEUE:
        if priority_filter and sfx["priority"] != priority_filter:
            continue
        path = os.path.join(output_dir, f"{sfx['id']}.mp3")
        if os.path.exists(path) and not force:
            print(f"[{sfx['id']}] skip (exists)")
            continue
        sound_effects(sfx["prompt"], sfx["duration"], path)


if __name__ == "__main__":
    if not ELEVENLABS_API_KEY:
        print("Set ELEVENLABS_API_KEY env var first, e.g.:")
        print("  export ELEVENLABS_API_KEY='your-key-here'")
    else:
        check_api_access()
        # list_voices()
        # text_to_speech("Hello from Kiva.", voice_id="REPLACE_WITH_VOICE_ID")
        # generate_all(priority_filter="P0")  # ⏸ AWAITING STEVE APPROVAL — do not uncomment yet
