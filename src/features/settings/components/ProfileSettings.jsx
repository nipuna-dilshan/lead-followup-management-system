import { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { COACH_NAME, COACH_TITLE } from '../../../lib/constants';

export default function ProfileSettings({ profile, onSave, saving }) {
  const [values, setValues] = useState({
    full_name: COACH_NAME,
    phone: '',
    ...profile,
  });

  useEffect(() => {
    if (profile) {
      setValues((prev) => ({ ...prev, ...profile }));
    }
  }, [profile]);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({ full_name: values.full_name, phone: values.phone });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <Input
        label="Coach Name"
        id="profile-full-name"
        name="full_name"
        value={values.full_name || ''}
        onChange={handleChange}
        placeholder={COACH_NAME}
        disabled={saving}
      />
      <Input
        label="Email"
        id="profile-email"
        name="email"
        type="email"
        value={values.email || ''}
        disabled
        hint="Email is managed through your authentication settings."
        className="opacity-60"
      />
      <Input
        label="Phone"
        id="profile-phone"
        name="phone"
        type="tel"
        value={values.phone || ''}
        onChange={handleChange}
        placeholder="+44 7911 000000"
        disabled={saving}
      />
      <Button type="submit" loading={saving}>
        Save Profile
      </Button>
    </form>
  );
}
