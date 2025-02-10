import { ArticleProvider } from '@gitroom/nestjs-libraries/integrations/article/article.integrations.interface';

export class TruthProvider implements ArticleProvider {
  identifier = 'truth';
  name = 'Truth Social';

  async authenticate(token: string) {
    const {
      data: { name, id, imageUrl, username },
    } = await (
      await fetch('http://poster/truth/me', {
        headers: {
          Authorization: `Basic ${token}`,
        },
      })
    ).json();

    return {
      id,
      name,
      token,
      picture: imageUrl,
      username,
    };
  }
  async post(token: string, content: string) {
    const { data } = await (
      await fetch('http://poster/truth', {
        method: 'POST',
        body: JSON.stringify({
          content,
        }),
        headers: {
          Authorization: `Basic ${token}`,
          'Content-Type': 'application/json',
        },
      })
    ).json();

    return {
      postId: data.id,
      releaseURL: data.url,
    };
  }
}
