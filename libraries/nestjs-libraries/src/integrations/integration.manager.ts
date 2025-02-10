import 'reflect-metadata';

import { ArticleProvider } from '@gitroom/nestjs-libraries/integrations/article/article.integrations.interface';
import { DevToProvider } from '@gitroom/nestjs-libraries/integrations/article/dev.to.provider';
import { HashnodeProvider } from '@gitroom/nestjs-libraries/integrations/article/hashnode.provider';
import { MediumProvider } from '@gitroom/nestjs-libraries/integrations/article/medium.provider';
import { BlueskyProvider } from '@gitroom/nestjs-libraries/integrations/social/bluesky.provider';
import { DiscordProvider } from '@gitroom/nestjs-libraries/integrations/social/discord.provider';
import { DribbbleProvider } from '@gitroom/nestjs-libraries/integrations/social/dribbble.provider';
import { FacebookProvider } from '@gitroom/nestjs-libraries/integrations/social/facebook.provider';
import { FarcasterProvider } from '@gitroom/nestjs-libraries/integrations/social/farcaster.provider';
import { InstagramProvider } from '@gitroom/nestjs-libraries/integrations/social/instagram.provider';
import { InstagramStandaloneProvider } from '@gitroom/nestjs-libraries/integrations/social/instagram.standalone.provider';
import { LemmyProvider } from '@gitroom/nestjs-libraries/integrations/social/lemmy.provider';
import { LinkedinPageProvider } from '@gitroom/nestjs-libraries/integrations/social/linkedin.page.provider';
import { LinkedinProvider } from '@gitroom/nestjs-libraries/integrations/social/linkedin.provider';
import { MastodonProvider } from '@gitroom/nestjs-libraries/integrations/social/mastodon.provider';
import { NostrProvider } from '@gitroom/nestjs-libraries/integrations/social/nostr.provider';
import { PinterestProvider } from '@gitroom/nestjs-libraries/integrations/social/pinterest.provider';
import { RedditProvider } from '@gitroom/nestjs-libraries/integrations/social/reddit.provider';
import { SlackProvider } from '@gitroom/nestjs-libraries/integrations/social/slack.provider';
import { SocialProvider } from '@gitroom/nestjs-libraries/integrations/social/social.integrations.interface';
import { TelegramProvider } from '@gitroom/nestjs-libraries/integrations/social/telegram.provider';
import { ThreadsProvider } from '@gitroom/nestjs-libraries/integrations/social/threads.provider';
import { TiktokProvider } from '@gitroom/nestjs-libraries/integrations/social/tiktok.provider';
import { XProvider } from '@gitroom/nestjs-libraries/integrations/social/x.provider';
import { YoutubeProvider } from '@gitroom/nestjs-libraries/integrations/social/youtube.provider';
import { Injectable } from '@nestjs/common';
import { KoFiProvider } from './article/kofi.provider';
import { PatreonProvider } from './article/patreon.provider';
import { TruthProvider } from './article/truth.provider';

const socialIntegrationList: SocialProvider[] = [
  new XProvider(),
  new LinkedinProvider(),
  new LinkedinPageProvider(),
  new RedditProvider(),
  new InstagramProvider(),
  new InstagramStandaloneProvider(),
  new FacebookProvider(),
  new ThreadsProvider(),
  new YoutubeProvider(),
  new TiktokProvider(),
  new PinterestProvider(),
  new DribbbleProvider(),
  new DiscordProvider(),
  new SlackProvider(),
  new MastodonProvider(),
  new BlueskyProvider(),
  new LemmyProvider(),
  new FarcasterProvider(),
  new TelegramProvider(),
  new NostrProvider(),
  // new MastodonCustomProvider(),
];

const articleIntegrationList = [
  new TruthProvider(),
  new KoFiProvider(),
  new PatreonProvider(),
  new DevToProvider(),
  new HashnodeProvider(),
  new MediumProvider(),
];

@Injectable()
export class IntegrationManager {
  async getAllIntegrations() {
    return {
      social: await Promise.all(
        socialIntegrationList.map(async (p) => ({
          name: p.name,
          identifier: p.identifier,
          toolTip: p.toolTip,
          isExternal: !!p.externalUrl,
          isWeb3: !!p.isWeb3,
          ...(p.customFields ? { customFields: await p.customFields() } : {}),
        }))
      ),
      article: articleIntegrationList.map((p) => ({
        name: p.name,
        identifier: p.identifier,
      })),
    };
  }

  getAllPlugs() {
    return socialIntegrationList
      .map((p) => {
        return {
          name: p.name,
          identifier: p.identifier,
          plugs: (
            Reflect.getMetadata('custom:plug', p.constructor.prototype) || []
          ).map((p: any) => ({
            ...p,
            fields: p.fields.map((c: any) => ({
              ...c,
              validation: c?.validation?.toString(),
            })),
          })),
        };
      })
      .filter((f) => f.plugs.length);
  }

  getInternalPlugs(providerName: string) {
    const p = socialIntegrationList.find((p) => p.identifier === providerName)!;
    return {
      internalPlugs:
        Reflect.getMetadata('custom:internal_plug', p.constructor.prototype) ||
        [],
    };
  }

  getAllowedSocialsIntegrations() {
    return socialIntegrationList.map((p) => p.identifier);
  }
  getSocialIntegration(integration: string): SocialProvider {
    return socialIntegrationList.find((i) => i.identifier === integration)!;
  }
  getAllowedArticlesIntegrations() {
    return articleIntegrationList.map((p) => p.identifier);
  }
  getArticlesIntegration(integration: string): ArticleProvider {
    return articleIntegrationList.find((i) => i.identifier === integration)!;
  }
}
