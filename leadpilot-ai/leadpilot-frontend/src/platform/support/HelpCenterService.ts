import { Article, SAMPLE_ARTICLES, SAMPLE_CATEGORIES, ArticleCategory } from "@/domain/support/Article";

export class HelpCenterService {
  getCategories(): ArticleCategory[] {
    return SAMPLE_CATEGORIES;
  }

  getArticles(): Article[] {
    return SAMPLE_ARTICLES;
  }

  searchArticles(query: string): Article[] {
    const q = query.toLowerCase();
    return SAMPLE_ARTICLES.filter(
      (art) => art.title.toLowerCase().includes(q) || art.content.toLowerCase().includes(q)
    );
  }
}
