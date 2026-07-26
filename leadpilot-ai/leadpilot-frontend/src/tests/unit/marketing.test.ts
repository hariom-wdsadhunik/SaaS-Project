import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

describe("Marketing Website & SEO Unit Tests", () => {
  test("generates valid sitemap entries for indexation", () => {
    const map = sitemap();
    expect(map.length).toBeGreaterThan(0);
    expect(map[0].url).toBe("https://leadpilot.ai");
  });

  test("generates public robots.txt crawler rules", () => {
    const rules = robots();
    expect(rules.sitemap).toBe("https://leadpilot.ai/sitemap.xml");
  });
});
