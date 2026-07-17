const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ShareOptions {
  projectId: string;
  allowComments: boolean;
  allowEditing: boolean;
  passwordProtected: boolean;
  password?: string;
  expiresInDays?: number;
}

export async function shareProject(
  options: ShareOptions
): Promise<{ success: boolean; shareUrl: string }> {
  await delay(1000);

  const hash = Math.random().toString(36).substring(2, 9);
  return {
    success: true,
    shareUrl: `${window.location.origin}/share/proj-${hash}`,
  };
}
