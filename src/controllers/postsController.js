import postsRepository from "../repositories/postsRepository.js";
import urlMetadata from "url-metadata";

export async function likePost(req, res) {
  try {
    await postsRepository.insertLike(res.locals.id_user, req.params.id);

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function deslikePost(req, res) {
  try {
    await postsRepository.deleteLike(res.locals.id_user, req.params.id);

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

export async function createPost(req, res) {
  //const {username, userId} = res.locals.user;
  const userId = 3;
  const { url, description } = req.body;

  const hashtags = description?.trim().match(/(#[A-Za-z0-9]*)/g)?.map(el => el.replace('#', ""));
  console.log(hashtags);

  try {
    const hashtagsId = [];
    if (hashtags) {
      const newHashtags = [];
      const sumHashtag = [];
      //const hashExist = hashtags?.map(async (hashtag) => await postsRepository.searchHashtag(hashtag));
      for (const hashtag of hashtags) {
        const { rows } = await postsRepository.searchHashtag(hashtag);
        if (rows[0]?.name) sumHashtag.push(rows[0].name);
        if (!rows[0]?.name) newHashtags.push(hashtag);
      }

      for (const hashtag of newHashtags) {
        const { rows } = await postsRepository.addNewHashtag(hashtag);
        hashtagsId.push(rows[0].id);
      }

      for (const hashtag of sumHashtag) {
        const { rows } = await postsRepository.sumTag(hashtag);
        hashtagsId.push(rows[0].id);
      }
      console.log(newHashtags);
      console.log(sumHashtag);
    }
    console.log(hashtagsId)
    const { rows } = await postsRepository.addNewPost(userId, url, description);
    const idPost = rows[0].id;

    if (hashtags) {
      for (const idHashtag of hashtagsId) await postsRepository.postXHash(idHashtag, idPost)
    }

    res.sendStatus(200);
  } catch (error) {
    console.log(error)
    res.sendStatus(500);
  }
}

export async function deletePost(req, res) {
  const description = res.locals.description;
  const { postId } = req.params;
  const hashtagsId = []

  const hashtags = description?.trim().match(/(#[A-Za-z0-9]*)/g)?.map(el => el.replace('#', ""));
  console.log({ hashtags: hashtags });

  try {

    if (hashtags) {
      console.log("nao entra aqui");
      for (const hashtag of hashtags) {
        const { rows } = await postsRepository.subTag(hashtag);
        hashtagsId.push(rows[0].id);
      }

      for (const hashtag of hashtagsId) {
        const { rows } = await postsRepository.removepostXHash(hashtag, postId);
      }
    }
    console.log(hashtagsId)

    await postsRepository.removeLikes(postId);
    await postsRepository.removePost(postId);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500)
  }

}

export async function updatePost(req, res) {
  const description = res.locals.description;
  const { postId } = req.params;
  const hashtagsId = [];
  const hashtagsIdNewDes = []
  const newDescription = req.body.description;

  const hashtags = description?.trim().match(/(#[A-Za-z0-9]*)/g)?.map(el => el.replace('#', ""));
  const newDescHash = newDescription?.trim().match(/(#[A-Za-z0-9]*)/g)?.map(el => el.replace('#', ""));
  console.log({ hashtags, newDescHash });

  try {

    if (hashtags) {
      console.log("nao entra aqui");
      for (const hashtag of hashtags) {
        const { rows } = await postsRepository.subTag(hashtag);
        hashtagsId.push(rows[0].id);
      }

      for (const hashtag of hashtagsId) await postsRepository.removepostXHash(hashtag, postId);

    }

    if (newDescHash) {
      const newHashtags = [];
      const sumHashtag = [];
      for (const hashtag of newDescHash) {
        const { rows } = await postsRepository.searchHashtag(hashtag);
        if (rows[0]?.name) sumHashtag.push(rows[0].name);
        if (!rows[0]?.name) newHashtags.push(hashtag);
      }

      for (const hashtag of newHashtags) {
        const { rows } = await postsRepository.addNewHashtag(hashtag);
        hashtagsIdNewDes.push(rows[0].id);
      }

      for (const hashtag of sumHashtag) {
        const { rows } = await postsRepository.sumTag(hashtag);
        hashtagsIdNewDes.push(rows[0].id);
      }
      console.log(newHashtags);
      console.log(sumHashtag);

      for (const hashtag of hashtagsIdNewDes) await postsRepository.postXHash(hashtag, postId);
      
    }
    console.log(hashtagsId);
    console.log(hashtagsIdNewDes);

    await postsRepository.newDescriptionPost(newDescription, postId)
    
    res.sendStatus(201);
  } catch (error) {
    console.log(error)
    res.sendStatus(500);
  }
}