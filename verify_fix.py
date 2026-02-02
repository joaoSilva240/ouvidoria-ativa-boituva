import os
import asyncio
from playwright.async_api import async_playwright

# Ensure screenshots directory exists
os.makedirs("docs/screenshots", exist_ok=True)

# Fix for "HOME not set" error on some environments
if "HOME" not in os.environ:
    os.environ["HOME"] = os.environ.get("USERPROFILE", "")

async def run():
    print("Starting Playwright for Category Check...")
    try:
        async with async_playwright() as p:
            print("Launching browser...")
            browser = await p.chromium.launch()
            context = await browser.new_context(viewport={"width": 1280, "height": 720})
            page = await context.new_page()
            
            # Category Page
            url = "http://localhost:3000/registro/categoria"
            print(f"Navigating to {url}...")
            try:
                # Wait for network idle to ensure next.js finished hydration
                await page.goto(url, wait_until="networkidle", timeout=15000)
                # Wait a bit more for framer motion animations
                await asyncio.sleep(2)
                
                path = "docs/screenshots/verify_categories.png"
                await page.screenshot(path=path)
                print(f"✅ Screenshot saved to {path}")
            except Exception as e:
                print(f"❌ Failed to capture Category Screen: {e}")

            await browser.close()
    except Exception as e:
        print(f"CRITICAL ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(run())
