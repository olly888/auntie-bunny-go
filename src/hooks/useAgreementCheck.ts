import { useState, useEffect } from "react";

export const useAgreementCheck = () => {
  const [needsAgreement, setNeedsAgreement] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    checkAgreement();
  }, []);

  const checkAgreement = () => {
    const storedProfile = localStorage.getItem("mock_user_profile");
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      setProfile(parsedProfile);
      
      // 检查是否已签署协议
      if (!parsedProfile.agreement_signed_at) {
        setNeedsAgreement(true);
      }
    }
  };

  const signAgreement = () => {
    if (!profile) return;

    const updatedProfile = {
      ...profile,
      agreement_signed_at: new Date().toISOString(),
      agreement_version: 'v1.0',
      agreement_ip: 'mock_ip' // 实际应该获取真实IP
    };

    localStorage.setItem("mock_user_profile", JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
    setNeedsAgreement(false);
  };

  return {
    needsAgreement,
    setNeedsAgreement,
    signAgreement,
    profile
  };
};