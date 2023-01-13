import postsRepository from "../repositories/postsRepository.js";
import urlMetadata from "url-metadata";
import { getAllFollowing, listUserById } from "../repositories/authRepository.js";

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
  const idUser = res.locals.id_user;
  const { offset } = req.query;
  const { noLimit } = req.query;

  try {
    const follows = await getAllFollowing(idUser);

    const listFolloweds = [idUser];
    for (const f of follows.rows) {
      listFolloweds.push(f.id_user_followed)
    }

    const { rows } = await postsRepository.getAllPosts({ offset, noLimit });
    const { rows: reposts } = await postsRepository.getReposts();
    const { rows: repostedamounts } = await postsRepository.amountReposted();
    //console.log(repostedamounts)

    const postsByFolloweds = [];
    const repostByFolloweds = [];

    for (let post of rows) {
      if (listFolloweds.includes(post.id)) {
        const metadata = await urlMetadata(post.url);
        post.title = metadata.title;
        post.image = metadata.image;
        post.linkDescription = metadata.description;

        postsByFolloweds.push(post);

        for (let countRep of repostedamounts) {
          if (post.postId === countRep.id_post) post.repostCount = countRep.count
        }
      }
    }

    for (let repost of reposts) {
      console.log(listFolloweds)
      console.log(repost.repostedBy[0].id)
      if (listFolloweds.includes(repost.repostedBy[0].id)) {
        const metadata = await urlMetadata(repost.url);
        repost.title = metadata.title;
        repost.image = metadata.image;
        repost.linkDescription = metadata.description;
        //console.log("entrou no if")

        postsByFolloweds.push(repost);

        for (let countRep of repostedamounts) {
          if (repost.postId === countRep.id_post) repost.repostCount = countRep.count
        }
      }
    }

    // const postsByFollowedsByDate = postsByFolloweds.sort((a, b) => {
    //   if (a, b) return 1
    // })
    res.send(postsByFolloweds)
    //res.send(postsByFollowedsByDate);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}


export async function getAllPostsByUserId(req, res) {
  const id = req.params.id;

  try {
    const { rows } = await postsRepository.getAllPostsByUserId(id);
    const { rows: user } = await listUserById(id);
    const { rows: repostedamounts } = await postsRepository.amountReposted();


    for (const post of rows) {
      const metadata = await urlMetadata(post.url);
      post.title = metadata.title;
      post.image = metadata.image;
      post.linkDescription = metadata.description;

      for (let countRep of repostedamounts) {
        if (post.postId === countRep.id_post) post.repostCount = countRep.count
      }
    }

    res.send({ posts: rows, username: user[0].username });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function createPost(req, res) {
  const userId = res.locals.id_user;
  const { url, description } = req.body;

  const untreatedHashtags = description?.trim().match(/(#[A-Za-z0-9]*)/g)?.map(el => el.replace('#', ""));
  const treatement = new Set();
  untreatedHashtags?.forEach((hashtag) => {
    treatement.add(hashtag)
  })
  const hashtags = [...treatement.values()]

  try {
    const hashtagsId = [];
    if (hashtags) {
      const newHashtags = [];
      const existentHashtag = [];

      for (const hashtag of hashtags) {
        const { rows } = await postsRepository.searchHashtag(hashtag);
        if (rows[0]?.name) existentHashtag.push(rows[0].name);
        if (!rows[0]?.name) newHashtags.push(hashtag);
      }

      for (const hashtag of newHashtags) {
        const { rows } = await postsRepository.addNewHashtag(hashtag);
        hashtagsId.push(rows[0].id);
      }

      for (const hashtag of existentHashtag) {
        const { rows } = await postsRepository.getTagId(hashtag);
        hashtagsId.push(rows[0].id);
      }
    }

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

  const untreatedHashtags = description?.trim().match(/(#[A-Za-z0-9]*)/g)?.map(el => el.replace('#', ""));
  const treatement = new Set();
  untreatedHashtags?.forEach((hashtag) => {
    treatement.add(hashtag)
  })
  const hashtags = [...treatement.values()]
 

  try {
    if (hashtags) {
      for (const hashtag of hashtags) {
        const { rows } = await postsRepository.getTagId(hashtag);
        hashtagsId.push(rows[0].id);
      }

      for (const hashtag of hashtagsId) {
        const { rows } = await postsRepository.removepostXHash(hashtag, postId);
      }
    }

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

  const untreatedHashtags = description?.trim().match(/(#[A-Za-z0-9]*)/g)?.map(el => el.replace('#', ""));
  const treatement = new Set();
  untreatedHashtags?.forEach((hashtag) => {
    treatement.add(hashtag)
  })
  const hashtags = [...treatement.values()]

  const untreatedNewDescHash = newDescription?.trim().match(/(#[A-Za-z0-9]*)/g)?.map(el => el.replace('#', ""));
  const treatementNew = new Set();
  untreatedNewDescHash?.forEach((hashtag) => {
    treatementNew.add(hashtag)
  })
  const newDescHash = [...treatementNew.values()]

  console.log("old:", hashtags);
  console.log("new:", newDescHash )


  try {
    if (hashtags) {
      for (const hashtag of hashtags) {
        const { rows } = await postsRepository.getTagId(hashtag);
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
        const { rows } = await postsRepository.getTagId(hashtag);
        hashtagsIdNewDes.push(rows[0].id);
      }

      for (const hashtag of hashtagsIdNewDes) await postsRepository.postXHash(hashtag, postId);

    }

    await postsRepository.newDescriptionPost(newDescription, postId)

    res.sendStatus(201);
  } catch (error) {
    console.log(error)
    res.sendStatus(500);
  }
}

export async function commentPost(req, res) {
  try {
    await postsRepository.insertComment(
      res.locals.id_user,
      req.params.id,
      req.body.comment
    )
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function repost(req, res) {
  const userId = res.locals.id_user;
  const { postId } = req.params;
  console.log(userId)

  try {
    await postsRepository.respostBy(userId, postId)
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}