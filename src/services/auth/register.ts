import { api } from "@/lib/api-manager";
import { NAHERO_API } from "@/constants/nahero-api"; // Adjust path if needed

export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export async function registerUser(data: RegisterUserRequest) {
  try {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    const response = await api.post(NAHERO_API.USERS.REGISTER, payload);

    if (response.status === 201 || response.status === 200)
      return response.data;
  } catch (error) {
    throw error;
  }
  return null;
}
