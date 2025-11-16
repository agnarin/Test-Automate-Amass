
import { test, expect } from '@playwright/test';


test.beforeEach(async ({ page }) => {

  await page.goto('/');
});


test('TC-001: Should load the page and display initial comment', async ({ page }) => {

  await expect(page.getByText('IT 08-1')).toBeVisible();


  await expect(page.getByAltText('Dog and cat on grass')).toBeVisible();


  await expect(page.getByText('have a good day')).toBeVisible();
});


test('TC-002: Should allow user to post a new comment', async ({ page }) => {
  const newCommentText = 'This is my test comment!';
  

  const commentInput = page.getByPlaceholder('Comment');


  await commentInput.fill(newCommentText);


  await commentInput.press('Enter');

 
  await expect(page.getByText(newCommentText)).toBeVisible();
});


test('TC-003: Should NOT post an empty comment', async ({ page }) => {

  await expect(page.getByText('have a good day')).toBeVisible();
  const commentList = page.locator('.comment-row .comment-text');
  const initialCount = await commentList.count();


  await page.getByPlaceholder('Comment').press('Enter');


  await expect(commentList).toHaveCount(initialCount);
});

test('TC-004: Should fail and take a screenshot', async ({ page }) => {
  
  await expect(page.getByText('This text does not exist')).toBeVisible();
});