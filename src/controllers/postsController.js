import postsRepository from "../repositories/postsRepository.js";
import urlMetadata from "url-metadata";

export async function likePost(req, res) {
  try {
    await postsRepository.likePost(res.locals.userId, req.params.id);

    res.send(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function deslikePost(req, res) {
  try {
    await postsRepository.deleteLike(res.locals.userId, req.params.id);

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function getAllPosts(req, res) {
  try {
    const { rows } = await postsRepository.getAllPosts();

    for (const post of rows) {
      const metadata = await urlMetadata(post.url);
      post.title = metadata.title;
      post.image = metadata.image;
      post.linkDescription = metadata.description;
    }

    res.send(rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}


export async function getAllPostsByUserId(req, res) {
  const id = req.params.id;

  try {
    const { rows } = await postsRepository.getAllPostsByUserId(id);

    for (const post of rows) {
      const metadata = await urlMetadata(post.url);
      post.title = metadata.title;
      post.image = metadata.image;
      post.linkDescription = metadata.description;
    }

    res.send(rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export  async function createPost(req, res) {
  //const {username, userId} = res.locals.user;
  const { url, description } = req.body;

  const hashtags = description?.trim().match(/(#[A-Za-z0-9]*)/g).map(el => el.replace('#', ""));
  console.log(hashtags);

  try {

    if (hashtags) {
      const newHashtags = [];
      const sumHashtag = [];
      //const hashExist = hashtags?.map(async (hashtag) => await postsRepository.searchHashtag(hashtag));
      for (const hashtag of hashtags ) {
        const { rows } = await postsRepository.searchHashtag(hashtag);
        if (rows[0]?.name) sumHashtag.push(rows[0].name);
        if (!rows[0]?.name) newHashtags.push(hashtag);
      }

      for (const hashtag of newHashtags) {
        await postsRepository.addNewHashtag(hashtag);
      }

      console.log(newHashtags);
      console.log(sumHashtag);
    }

    res.sendStatus(200);
  } catch (error) {
    console.log(error)
    res.sendStatus(500);
  }
}