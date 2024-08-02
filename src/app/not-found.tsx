'use client';
import { IllustrationNotFound, IllustrationNotFoundDark } from '@douyinfe/semi-illustrations';
import { Button, Empty } from '@douyinfe/semi-ui';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Empty image={<IllustrationNotFound />} darkModeImage={<IllustrationNotFoundDark />} title='404' description='找不到此页面'>
      <Link href='/' passHref legacyBehavior>
        <Button theme='solid' type='primary'>返回首页</Button>
      </Link>
    </Empty>
  );
}
