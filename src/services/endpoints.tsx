const API = process.env.NEXT_PUBLIC_BASE_URL_API;

const endPoints = {
  contact: `${API}/contact`,
  sanctum: `${API}/sanctum/csrf-cookie`,
  user: {
    get: `${API}/user`,
    update: `${API}/user`,
    login: `${API}/user/login`,
    logout: `${API}/user/logout`,
    register: `${API}/user/register`,
    payment: `${API}/user/payment`,
    resetPasswordLogged: `${API}/user/password/reset`,
    tempPassword: `${API}/user/password/temp`,
  },
  constructions: {
    get: `${API}/dashboard/constructions`,
    getOne: (slug: string) => `${API}/constructions/${slug}`,
    loads: {
      all: (id: string) => `${API}/constructions/${id}/loads`,
      one: (constructionId: string, loadId: string | number) => `${API}/constructions/${constructionId}/loads/${loadId}`,
    },
  },
  loads: {
    create: `${API}/loads`,
  },

  employees: {
    get: `${API}/employees`,
  },
};

export default endPoints;
