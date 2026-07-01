'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SubmitForm() {
  const [formData, setFormData] = useState({
    gamerTag: '',
    discordTag: '',
    game: '',
  });

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
    </div>
  );
}