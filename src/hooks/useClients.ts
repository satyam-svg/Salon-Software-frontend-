// src/hooks/useClients.ts
import useSWR from "swr";
import axios from "axios";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useClients = (salonId?: string) => {
  return useSWR(
    salonId ? `${BACKEND}api/clients/gettotalclient/${salonId}` : null,
    async (url) => {
      const res = await axios.get(url);
      if (!res.data.success) throw new Error("Failed to fetch clients");
      return res.data.clients;
    }
  );
};
