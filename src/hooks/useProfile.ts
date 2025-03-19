
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types';
import { toast } from 'sonner';

export const useProfile = (userId?: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const createProfile = async (cpf: string, birthDate: string, phone: string) => {
    if (!userId) {
      toast.error('Usuário não autenticado');
      return null;
    }

    try {
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (existingProfile) {
        const { data, error } = await supabase
          .from('user_profiles')
          .update({
            cpf,
            birth_date: birthDate,
            phone
          })
          .eq('id', userId)
          .select()
          .single();

        if (error) throw error;
        setProfile(data);
        toast.success('Perfil atualizado com sucesso!');
        return data;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: userId,
            cpf,
            birth_date: birthDate,
            phone,
            loyalty_points: 0,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      toast.success('Perfil criado com sucesso!');
      return data;
    } catch (error) {
      console.error('Error creating/updating profile:', error);
      toast.error('Erro ao criar/atualizar perfil');
      return null;
    }
  };

  return {
    profile,
    loading,
    createProfile
  };
};
