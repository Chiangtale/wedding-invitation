import bcrypt from 'bcryptjs';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import AllPostsModal from 'components/guestbook/AllPostsModal';
import PostFormModal, {
  GuestBookPostForm,
} from 'components/guestbook/PostFormModal';
import SimplePostCard from 'components/guestbook/SimplePostCard';
import Section from 'components/Section';
import { usePostsDispatch } from 'contexts/PostsContext';
import useFetchPosts from 'hooks/useFetchPosts';
import { db } from 'utils/firebase';
import { trackEvent } from 'utils/gtag';

const PostsContainer = styled.div`
  &::-webkit-scrollbar {
    height: 0.5rem;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 0.25rem;
    background: #ccc;
  }
`;

export interface Post {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
}

function GuestBook() {
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [isPostsModalOpen, setIsPostsModalOpen] = useState<boolean>(false);
  const { posts, fetchFirstPage } = useFetchPosts();
  const dispatch = usePostsDispatch();

  const handleFormModalOpen = () => {
    trackEvent('open_guestbook_form');
    setIsFormModalOpen(true);
  };
  const handleFormModalClose = () => {
    setIsFormModalOpen(false);
  };

  const handleAllPostsModalOpen = () => {
    trackEvent('open_guestbook_all_posts');
    setIsPostsModalOpen(true);
  };
  const handleAllPostsModalClose = () => {
    setIsPostsModalOpen(false);
  };

  useEffect(() => {
    fetchFirstPage();
  }, [fetchFirstPage]);

  const onFormValid = async (data: GuestBookPostForm) => {
    const { name, password, content } = data;
    const createdAt = new Date();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const docRef = await addDoc(collection(db, 'guestBook'), {
      name,
      password: hashedPassword,
      content: content.replaceAll('\n', '\\n'),
      isDeleted: false,
      createdAt,
    });
    const newDocument = await getDoc(doc(db, 'guestBook', docRef.id));
    dispatch({ type: 'ADD_ITEM_FIRST', post: newDocument });
    setIsFormModalOpen(false);
    trackEvent('write_guest_book', { name });
    toast.info('게시글이 작성되었어요!');
    return true;
  };

  return (
    <Section className="py-20">
      <div className="w-full max-w-2xl mx-auto space-y-12 md:px-4">
        <h1 className="text-3xl text-center">방명록</h1>
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="flex flex-col w-full h-64 py-4 relative justify-center items-center">
              <span>아직 아무 글도 없어요.</span>
              <span>새 글을 남겨보세요!</span>
            </div>
          ) : (
            <PostsContainer className="overflow-x-auto flex w-full space-x-3 h-64 py-4 relative">
              {posts.slice(0, 10).map((post) => (
                <SimplePostCard key={post.id} post={post} />
              ))}
            </PostsContainer>
          )}
          <div className="flex flex-row justify-end space-x-2 text-sm font-sans">
            {posts.length >= 1 && (
              <button className="p-1" onClick={handleAllPostsModalOpen}>
                전체 보기
              </button>
            )}
            <button
              className="p-1 font-bold flex-row"
              onClick={handleFormModalOpen}
            >
              글 남기기
            </button>
          </div>
        </div>
      </div>
      <PostFormModal
        isOpen={isFormModalOpen}
        handleClose={handleFormModalClose}
        onFormValid={onFormValid}
      />
      <AllPostsModal
        isOpen={isPostsModalOpen}
        handleClose={handleAllPostsModalClose}
      />
    </Section>
  );
}

export default GuestBook;
