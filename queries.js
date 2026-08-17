const pool = require('./db/pool');

// 1. Get all bookmarks along with the username of the person who saved them.
//    Only bookmarks with a matching user are returned.
//    Return an array of objects. Each object should have: title, url, username.
const getAllBookmarksWithUsername = async () => {
  const result = await pool.query(`
    SELECT b.title, b.url, u.username
    FROM bookmarks b
    JOIN users u ON b.user_id = u.user_id
  `);
  return result.rows;
};

// 2. Get all bookmarks saved by a specific user.
//    Return an array of objects. Each object should have: title, url, username.
const getBookmarksByUsername = async (username) => {
  const result = await pool.query(`
    SELECT b.title, b.url, u.username
    FROM bookmarks b
    JOIN users u ON b.user_id = u.user_id
    WHERE u.username = $1
  `, [username]);
  return result.rows;
};

// 3. Get all bookmarks that have at least one tag, along with the tag name.
//    A bookmark with two tags should appear twice (once per tag).
//    Return an array of objects. Each object should have: title, url, tag_name.
const getBookmarksWithAllTags = async () => {
  const result = await pool.query(`
    SELECT b.title, b.url, t.name AS tag_name
    FROM bookmarks b
    JOIN bookmark_tags bt ON b.bookmark_id = bt.bookmark_id
    JOIN tags t ON bt.tag_id = t.tag_id
  `);
  return result.rows;
};

// 4. Get all users and the total number of bookmarks they have saved.
//    Users with zero bookmarks are included (showing 0, not excluded).
//    Group by users.user_id and alias the count as total_bookmarks.
//    Return an array of objects. Each object should have: username, total_bookmarks.
const getUsersWithBookmarkCount = async () => {
  const result = await pool.query(`
    SELECT u.username, COUNT(b.bookmark_id) AS total_bookmarks FROM users u 
    LEFT JOIN bookmarks b ON u.user_id = b.user_id
    GROUP BY u.user_id`);
    return result.rows;
};

// 5. Get all bookmarks that have no tags.
//    Return an array of objects. Each object should have: title, url, username.
const getBookmarksWithNoTags = async () => {
  const result = await pool.query(`
        SELECT b.title, b.url, u.username
    FROM bookmarks b
    JOIN users u ON b.user_id = u.user_id
    LEFT JOIN bookmark_tags bt ON b.bookmark_id = bt.bookmark_id
    WHERE bt.bookmark_id IS NULL
  `);
  return result.rows;
};

const main = async () => {
  console.log('--- 1. All Bookmarks With Username ---');
  console.log(await getAllBookmarksWithUsername());

  console.log('\n--- 2. Bookmarks by alice_j ---');
  console.log(await getBookmarksByUsername('alice_j'));

  console.log('\n--- 3. Bookmarks With All Tags ---');
  console.log(await getBookmarksWithAllTags());

  console.log('\n--- 4. Users With Bookmark Count ---');
  console.log(await getUsersWithBookmarkCount());

  console.log('\n--- 5. Bookmarks With No Tags ---');
  console.log(await getBookmarksWithNoTags());

  await pool.end();
};

main();