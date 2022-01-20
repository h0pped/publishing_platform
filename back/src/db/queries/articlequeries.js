export const getRecentArticles = () =>
  'Select * from Article where status_id=(select id from ArticleStatus where title="Active") order by postDate DESC LIMIT 9;';

export const getUserArticles = (email) =>
  `Select * from Article where user_id=(select id from User where email="${email}") and status_id=(select id from ArticleStatus where title="Active") order by postDate DESC;`;

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
export const createArticle = (articleData) => `
Insert into Article(\`user_id\`,\`title\`,\`description\`,\`thumbnail_path\`,\`postDate\`,\`category_id\`,\`status_id\`) values
((Select id from user where email="${articleData.email}"),
"${articleData.title}",
"${articleData.description}",
${articleData.imgpath ? `"${articleData.imgpath}"` : null},
NOW(),
(Select id from category where title="${articleData.category.title}"),
(Select id from ArticleStatus where title="Active"));
`;

export const createTag = (tag) => `
Insert into Tag(\`title\`)
values("${tag}");
`;

export const linkTag = (tag, articleID) => `
Insert into Article_Tag(\`article_id\`,\`tag_id\`) values
(${articleID},(select id from Tag where title="${tag}"));
`;

export const addSection = (section, articleID, order) => `
Insert into ArticleSection(\`article_id\`,\`title\`,\`content\`,\`order\`) values
(
${articleID},
"${section.title}",
"${section.content}",
${order}
);
`;

export const addSectionGallery = (gallery, sectionID) => `
Insert into SectionGallery(\`section_id\`,\`title\`) values
(
${sectionID},
"${gallery.title}"
);
`;
export const linkPhotoWithGallery = (
  photoID,
  galleryID,
  title,
  alt,
  source
) => `
Insert Into SectionGallery_Photo(\`gallery_id\`,\`photo_id\`,\`title\`,\`alt_text\`,\`source\`) values
(${galleryID},
${photoID},
"${title}",
"${alt}",
"${source}");

`;

export const getArticleLikes = (articleID) => `
  Select Count(*) as Likes from \`Like\`
  where article_id=${articleID}
`;
