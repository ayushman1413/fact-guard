# 🎬 FactGuard Demo Video Guide

Create a professional 30-second demo video showcasing FactGuard's fact-checking capabilities.

---

## What to Show (30 Seconds)

Your demo should show:
1. **Homepage** (3 sec) — Show the clean UI with upload zone
2. **PDF Upload** (3 sec) — Drag & drop or select a PDF
3. **Processing** (8 sec) — Show the loading state and progress
4. **Results** (13 sec) — Display the fact-check report with verdicts
5. **Summary** (3 sec) — Show the summary cards (Verified, Inaccurate, False counts)

---

## Tools for Recording

### Option 1: Built-in Tools (Free)

#### macOS
- **QuickTime Player** — Already installed
  ```bash
  # Open QuickTime
  cmd + space → "QuickTime" → File → New Screen Recording
  ```
- **ScreenFlow** — Professional ($129, but free trial)

#### Windows
- **Windows 10/11 Built-in** — Windows Key + G → Game Bar
- **OBS Studio** — Free, open-source (more complex)

#### Linux
- **SimpleScreenRecorder** — Free
- **OBS Studio** — Free, open-source

### Option 2: Online Tools (Easiest)

1. **Loom** (Free) — [loom.com](https://loom.com)
   - Free 25 recordings/month
   - Auto-generates transcripts
   - Easy sharing
   
2. **ScreenRec** (Free) — [screenrec.com](https://screenrec.com)
   - No signup required
   - Instant sharing

3. **Clipchamp** (Free) — [clipchamp.com](https://clipchamp.com)
   - Built into Windows
   - Full editing suite

---

## Step-by-Step Recording Guide

### Preparation

1. **Set up your demo PDF**
   - Choose a PDF with 5-10 factual claims
   - Mix of true, false, and inaccurate claims works best
   - Example claims:
     - "Google was founded in 1998" ✓ (true)
     - "COVID-19 started in 2018" ✗ (false)
     - "World population is 7 billion" ~ (inaccurate - it's 8B)

2. **Prepare your environment**
   - Close unnecessary windows and notifications
   - Set dark mode or light mode (choose what looks best)
   - Make sure FactGuard is loaded and ready to use
   - Test PDF upload beforehand

3. **Script (optional but helpful)**
   ```
   "FactGuard: Instant Fact-Checking for PDF Content
   
   [Show upload page]
   Simply upload any PDF...
   
   [Drag & drop demo PDF]
   ...our AI extracts claims and verifies them instantly.
   
   [Show loading animation]
   Within seconds...
   
   [Show results table]
   ...you get detailed verdicts with sources.
   
   FactGuard: Your Truth Layer against hallucinated data."
   ```

### Recording (Using Loom as example)

1. **Start Loom recording**
   - Open [loom.com](https://loom.com) → **Start Recording**
   - Select the browser window
   - Click **Start Recording**

2. **Homepage Tour (3 sec)**
   - Show the clean FactGuard interface
   - Highlight the "Upload PDF" section
   - Quick pan over the features

3. **Upload PDF (3 sec)**
   - Drag a PDF onto the upload zone
   - OR click to select a file
   - Wait for file to load

4. **Show Processing (8 sec)**
   - Click **Analyze** button
   - Show the Loader component spinning
   - Show progress as claims are extracted
   - Let it process (or use pre-recorded processing if slow)

5. **Results Report (13 sec)**
   - **Show summary cards:**
     - Total Claims Extracted
     - Verified Count
     - Inaccurate Count
     - False Count
   
   - **Scroll through results table:**
     - Show Verified claim (green badge)
     - Show Inaccurate claim (yellow badge)
     - Show False claim (red badge)
     - Highlight source links
   
   - **Show explanations:** Point out the verdict explanations

6. **Closing (3 sec)**
   - Return to top of page
   - Show the results one more time
   - End with a call-to-action like:
     - "Try FactGuard today!" or
     - "Deploy your own instance today!" or
     - "Visit [URL] to start fact-checking"

7. **Stop recording**
   - Press Stop in Loom
   - Review the video

---

## Editing Tips

### Trim & Cut (Using Loom)
1. After recording, Loom auto-saves
2. Click **Trim** to cut beginning/end
3. Remove any awkward pauses

### Add Captions (Optional)
1. Use Loom's built-in captions
2. Or add text overlays in post-production:
   - Claim Extraction
   - Fact Verification
   - Results Summary

### Audio Tips
- Speak clearly and concisely
- Use natural pauses (not too fast)
- Optional background music (royalty-free)
- Test audio levels before final recording

---

## Video Specs

### Technical Requirements
- **Duration:** 30 seconds (±5 seconds okay)
- **Resolution:** 1280x720 (720p) or 1920x1080 (1080p)
- **Format:** MP4 or WebM
- **Framerate:** 24, 30, or 60 fps
- **Codec:** H.264 video, AAC audio

### File Size
- Target: Under 50 MB
- Loom auto-optimizes
- Most online tools compress automatically

---

## Sharing Your Video

### Option 1: Include in GitHub
1. **GitHub Releases**
   - Create a release for v1.0
   - Attach the MP4 file
   - Add download link to README

   ```bash
   git tag -a v1.0 -m "FactGuard v1.0 Release"
   git push origin v1.0
   ```

2. **Link in README:**
   ```markdown
   ## Demo Video
   
   [Watch the 30-second demo](./demo.mp4) or [view on YouTube](https://youtube.com/...)
   ```

### Option 2: Host on YouTube
1. Upload to YouTube (unlisted or public)
2. Copy link and add to README
3. Embed in README:
   ```markdown
   [![Watch the demo](https://img.youtube.com/vi/VIDEO_ID/0.jpg)](https://youtu.be/VIDEO_ID)
   ```

### Option 3: Host on Loom
- Loom videos are shareable by default
- Share link: `https://loom.com/share/...`
- Embed in README:
  ```markdown
  [![Watch the demo](./demo-thumbnail.png)](https://loom.com/share/...)
  ```

---

## Example Demo Script (Spoken)

```
[0-3 sec - Show homepage]
"FactGuard is an AI-powered fact-checking tool 
that automatically verifies claims in PDFs."

[3-6 sec - Show upload]
"Simply upload any PDF document..."

[6-15 sec - Show processing and loading]
"...our system extracts factual claims
and searches the web for evidence,
all in just seconds."

[15-28 sec - Show results]
"You get a detailed report flagging each claim
as Verified, Inaccurate, or False,
with sources and corrections."

[28-30 sec - Call to action]
"Try FactGuard today at [your-url].vercel.app"
```

---

## Common Mistakes to Avoid

❌ **Too fast** — Let each section breathe (don't rush through)
❌ **No audio** — Silent videos are boring; add narration
❌ **Poor quality** — Ensure text is readable (1080p minimum)
❌ **Wrong PDF** — Use a PDF with clear, verifiable claims
❌ **Technical glitch** — Test everything before recording
❌ **No context** — Briefly explain what FactGuard does
❌ **Too long** — Stay under 30 seconds (strict time limit)

---

## Submission Format

For the assessment submission, provide:

```
📧 Email/Document containing:
├── 🔗 Deployed App Link
│   └── https://fact-guards.vercel.app
├── 📺 Demo Video
│   ├── Embedded as: <iframe> or link
│   ├── Duration: ~30 seconds
│   └── Format: MP4 or Loom link
└── 📦 GitHub Repository
    ├── https://github.com/your-username/factguard
    ├── Clean code ✓
    ├── SETUP.md ✓
    ├── DEPENDENCIES.md ✓
    └── README.md ✓
```

---

## Pro Tips

### Using Pre-recorded Components
If your internet is slow during live recording:
1. Pre-record the processing phase separately
2. Edit it in: Upload → Pre-recorded Processing → Results
3. Use Loom editing to speed up processing (show 8 sec in 2 sec)

### A/B Testing
Record 2 different demos:
1. **Fast version** — Mock mode, instant results
2. **Real version** — Using actual APIs with web search

Pick the one that looks cleanest!

### Backup Recording
Save your recording in 2 places:
1. Loom cloud storage (automatic)
2. Download MP4 to your computer

---

Happy recording! 🎬✨
