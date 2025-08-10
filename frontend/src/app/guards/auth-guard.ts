import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export function authGuard(): CanActivateFn {
  return () => {
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;

    if (!isAuthenticated) {
      window.alert('Debés iniciar sesión');
      window.location.href = '/login'; // redirige si no está autenticado
      return false;
    }

    return true;
  };
}
