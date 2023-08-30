import type { LocalizationResource } from "@clerk/types";
import { ptBR } from "@clerk/localizations";

export const ptBrLocalization: LocalizationResource = {
  ...ptBR,
  organizationProfile: {
    ...ptBR.organizationProfile,
    membersPage: {
      ...ptBR.organizationProfile?.membersPage,
      start: {
        ...ptBR.organizationProfile?.membersPage?.start,
        headerTitle__members: "Membros",
        headerTitle__invitations: "Convites",
      },
      invitationsTab: {
        table__emptyRow: "Sem convites em aberto",
        manualInvitations: {
          headerTitle: "Convites individuais",
          headerSubtitle: "Convide membros e ajuste convites em aberto",
        },
      },
    },
  },
  userProfile: {
    ...ptBR.userProfile,
    start: {
      ...ptBR.userProfile?.start,
      dangerSection: {
        title: "Perigo",
        deleteAccountButton: "Apagar Conta",
        deleteAccountTitle: "Apagar Conta",
        deleteAccountDescription:
          "Apagar sua conta e todos os dados associados a ela",
      },
    },
  },
};
