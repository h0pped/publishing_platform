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

export const getArticleByID = (articleID) => `
  Select * from Article where 
  ID=${articleID} and 
status_id=(select id from ArticleStatus where title="Active")
  LIMIT 1;
`;
export const getArticleSectionsByID = (articleID) => `
Select * from ArticleSection where article_id=${articleID} Order By \`order\` ASC;
`;

export const getSectionGallery = (sectionID) => `
  Select * from SectionGallery where section_id=${sectionID} LIMIT 1;
`;

export const getGalleryPhotos = (galleryID) => `
Select sgp.id, sgp.photo_id, p.filepath,sgp.title,sgp.alt_text,sgp.source from SectionGallery_Photo sgp
inner join Photo p on sgp.photo_id = p.id
where sgp.gallery_id=${galleryID};
`;
