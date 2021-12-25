export const getRecentArticles = () =>
  'Select * from Article where status_id=(select id from ArticleStatus where title="Active") order by postDate DESC LIMIT 9;';
