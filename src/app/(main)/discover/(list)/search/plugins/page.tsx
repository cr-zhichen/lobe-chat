import { redirect } from 'next/navigation';

import List from '@/app/(main)/discover/(list)/plugins/features/List';
import StructuredData from '@/components/StructuredData';
import { Locales } from '@/locales/resources';
import { ldModule } from '@/server/ld';
import { metadataModule } from '@/server/metadata';
import { DiscoverService } from '@/server/services/discover';
import { translation } from '@/server/translation';
import { isMobileDevice } from '@/utils/responsive';

type Props = { searchParams: { hl?: Locales; q?: string } };

export const generateMetadata = async ({ searchParams }: Props) => {
  const { t } = await translation('metadata', searchParams?.hl);

  return metadataModule.generate({
    description: t('discover.description'),
    title: t('discover.search'),
    url: '/discover/search/plugins',
  });
};

const Page = async ({ searchParams }: Props) => {
  const { q } = searchParams;
  if (!q) redirect(`/discover/plugins`);

  const { t, locale } = await translation('metadata', searchParams?.hl);
  const mobile = isMobileDevice();

  const discoverService = new DiscoverService();
  const items = await discoverService.searchTool(locale, q);

  const ld = ldModule.generate({
    description: t('discover.description'),
    title: t('discover.search'),
    url: '/discover/search/plugins',
    webpage: {
      enable: true,
      search: true,
    },
  });

  return (
    <>
      <StructuredData ld={ld} />
      <List items={items} mobile={mobile} searchKeywords={q} />
    </>
  );
};

Page.DisplayName = 'DiscoverSearchTools';

export default Page;
