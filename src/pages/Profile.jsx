import { useState } from "react";
import Container from "../components/layout/Container";
import ProfileCard from "../components/profile/ProfileCard";
import PreferencesModal from "../components/profile/PreferencesModal";
import ChangePasswordModal from "../components/auth/ChangePasswordModal";
import useAuth from "../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();
  const [openPrefs, setOpenPrefs] = useState(false);
  const [openPwd, setOpenPwd] = useState(false);

  const recordId = user?.recordId || user?.id || user?.Id || null;

  return (
    <Container style={{ padding: 24 }}>
      <h1>Perfil</h1>
      <div className="grid-2" style={{ marginTop: 16 }}>
        <ProfileCard onOpenPrefs={() => setOpenPrefs(true)} onOpenPwd={() => setOpenPwd(true)} />
      </div>

      <PreferencesModal open={openPrefs} onClose={() => setOpenPrefs(false)} recordId={recordId} />
      <ChangePasswordModal open={openPwd} onClose={() => setOpenPwd(false)} recordId={recordId} />
    </Container>
  );
}
