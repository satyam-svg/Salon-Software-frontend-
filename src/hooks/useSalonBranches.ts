// src/hooks/useSalonBranches.ts
import useSWR from "swr";
import axios from "axios";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useSalonBranches = (userId?: string) => {
  return useSWR(
    userId ? ["salon-branches", userId] : null,
    async ([, userId]) => {
      const userRes = await axios.get(`${BACKEND}api/users/${userId}`);
      const salonId = userRes.data.user?.salonId;

      if (!salonId) throw new Error("Salon not found");

      const [branchRes, salonRes] = await Promise.all([
        axios.post(`${BACKEND}api/branch/isbranch`, { salon_id: salonId }),
        axios.post(`${BACKEND}api/salon/getsalonbyid`, { id: salonId }),
      ]);

      return {
        branches: branchRes.data.branches || [],
        salon: salonRes.data.salon,
        salonId,
      };
    }
  );
};

