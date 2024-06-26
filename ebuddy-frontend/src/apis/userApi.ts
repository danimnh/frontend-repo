export const updateUserData = async (
  token: string | null | undefined,
  userId: string | undefined,
  data: any
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-user-data`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, data }),
    }
  );

  if (!response.ok) {
    throw new Error('Unauthorized');
  }

  return response.json();
};

export const fetchUserData = async (
  token: string | null | undefined,
  userId: string | undefined
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/fetch-user-data/${userId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Unauthorized');
  }

  return response.json();
};
