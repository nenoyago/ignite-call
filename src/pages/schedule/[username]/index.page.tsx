import { prisma } from '@lib/prisma';
import { Avatar, Heading, Text } from '@neno-ignite-ui/react';
import { GetStaticProps } from 'next';
import { ScheduleForm } from './ScheduleForm';
import { Container, UserHeader } from './styles';
import { NextSeo } from 'next-seo';

interface User {
  name: string;
  bio: string;
  avatarUrl: string;
}

type ScheduleProps = {
  user: User;
};

export default function Schedule({ user }: ScheduleProps) {
  return (
    <>
      <NextSeo title={`Agendar com ${user.name} | Ignite Call`} />
      <Container>
        <UserHeader>
          <Avatar src={user.avatarUrl} />
          <Heading>{user.name}</Heading>
          <Text>{user.bio}</Text>
        </UserHeader>

        <ScheduleForm />
      </Container>
    </>
  );
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username);

  const user = await prisma.user.findUnique({
    where: {
      username
    }
  });

  if (!user) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url
      }
    },
    revalidate: 60 * 60 * 24 // 24 hours
  };
};
