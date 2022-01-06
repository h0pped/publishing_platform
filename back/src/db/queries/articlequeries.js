export const getRecentArticles = () =>
  'Select * from Article where status_id=(select id from ArticleStatus where title="Active") order by postDate DESC LIMIT 9;';

export const getUserArticles = (email) =>
  `Select * from Article where user_id=(select id from user where email="${email}") and status_id=(select id from ArticleStatus where title="Active") order by postDate DESC;`;

export const getArticleCategory = (
  articleId
) => `select Article.ID as "article_id", Category.ID as "category_id", Category.Title, Category.thumbnail_path from Article
inner join Category on Article.category_id = Category.ID where Article.ID = ${articleId}`;

export const getArticleTags = (articleId) => `
Select tag.id as "tag_id",tag.title as "Tag" from Article_Tag a_t
inner join Tag as tag on a_t.tag_id=tag.id
where article_id=${articleId};`;
