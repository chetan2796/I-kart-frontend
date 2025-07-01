'use client';
import React from 'react';

export default function LoadingButton({ loading, children, ...props }) {
  return (
    <button
      disabled={loading}
      {...props}
      className={`relative px-4 py-2 rounded ${props.className}`}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
      ) : (
        children
      )}
    </button>
  );
}
