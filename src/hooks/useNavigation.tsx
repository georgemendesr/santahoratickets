
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { getAdminBatchesUrl, getEventUrl } from '@/utils/navigation';

export const useNavigation = () => {
  const navigate = useNavigate();

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const goToRewards = useCallback(() => {
    navigate('/recompensas');
  }, [navigate]);

  const goToMyVouchers = useCallback(() => {
    navigate('/meus-vouchers');
  }, [navigate]);

  const goToAdminEvents = useCallback(() => {
    navigate('/admin/eventos');
  }, [navigate]);

  const goToAdminBatches = useCallback((eventId?: string) => {
    navigate(getAdminBatchesUrl(eventId));
  }, [navigate]);

  const goToEventDetails = useCallback((eventId: string) => {
    navigate(getEventUrl(eventId));
  }, [navigate]);

  const navigateTo = useCallback((path: string, options?: { replace?: boolean }) => {
    navigate(path, options);
  }, [navigate]);

  return {
    goBack,
    goToRewards,
    goToMyVouchers,
    goToAdminEvents,
    goToAdminBatches,
    goToEventDetails,
    navigateTo
  };
};
