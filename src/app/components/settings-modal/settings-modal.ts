import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './settings-modal.html',
  styleUrls: ['./settings-modal.scss']
})
export class SettingsModalComponent {
  isOpen = signal(false);
  activeTab: 'perfil' | 'privacidade' | 'conta' = 'perfil';
  dirty = signal(false);
  close = output<void>();

  user = {
    username: 'joaodemo',
    email: 'demo@livepoll.io',
    avatarGradientIndex: 0,
  };

  // Gradientes disponíveis
  gradients = [
    'linear-gradient(135deg,#5B8DF7,#9B79F5)',
    'linear-gradient(135deg,#F06292,#9B79F5)',
    'linear-gradient(135deg,#52D9A0,#5B8DF7)',
    'linear-gradient(135deg,#F5B342,#F06292)',
    'linear-gradient(135deg,#9B79F5,#F06292)',
    'linear-gradient(135deg,#52D9A0,#9B79F5)',
  ];

  // Controle de submodais
  showEditUsername = signal(false);
  showEditEmail = signal(false);
  showEditPassword = signal(false);
  showDeleteConfirm = signal(false);

  // Dados temporários para edição
  editUsernameValue = '';
  editEmailValue = '';
  editPasswordData = { current: '', new: '', confirm: '' };

  open() {
    this.isOpen.set(true);
    this.dirty.set(false);
    this.activeTab = 'perfil';
    this.showEditUsername.set(false);
    this.showEditEmail.set(false);
    this.showEditPassword.set(false);
    this.showDeleteConfirm.set(false);
  }

  closeModal() {
    this.isOpen.set(false);
    this.close.emit();
  }

  setActiveTab(tab: 'perfil' | 'privacidade' | 'conta') {
    this.activeTab = tab;
  }

  markDirty() {
    this.dirty.set(true);
  }

  save() {
    console.log('Salvar configurações', this.user);
    this.dirty.set(false);
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  pickGradient(index: number) {
    this.user.avatarGradientIndex = index;
    this.markDirty();
  }

  openEditUsername() {
    this.editUsernameValue = this.user.username;
    this.showEditUsername.set(true);
  }

  openEditEmail() {
    this.editEmailValue = this.user.email;
    this.showEditEmail.set(true);
  }

  openEditPassword() {
    this.editPasswordData = { current: '', new: '', confirm: '' };
    this.showEditPassword.set(true);
  }

  openDeleteConfirm() {
    this.showDeleteConfirm.set(true);
  }

  saveUsername() {
    if (this.editUsernameValue.trim()) {
      this.user.username = this.editUsernameValue.trim();
      this.markDirty();
      this.showEditUsername.set(false);
    }
  }

  saveEmail() {
    if (this.editEmailValue.includes('@')) {
      this.user.email = this.editEmailValue;
      this.markDirty();
      this.showEditEmail.set(false);
    }
  }

  savePassword() {
    if (this.editPasswordData.new === this.editPasswordData.confirm && this.editPasswordData.new.length >= 6) {
      console.log('Alterar senha', this.editPasswordData);
      this.markDirty();
      this.showEditPassword.set(false);
    }
  }

  confirmDelete() {
    console.log('Conta excluída');
    this.showDeleteConfirm.set(false);
    this.closeModal();
  }

  cancelSubModal() {
    this.showEditUsername.set(false);
    this.showEditEmail.set(false);
    this.showEditPassword.set(false);
    this.showDeleteConfirm.set(false);
  }

  getInitials(): string {
    return this.user.username.charAt(0).toUpperCase() +
           (this.user.username.split(' ')[1]?.charAt(0) || '').toUpperCase();
  }

  exportData() {
    console.log('Exportar dados');
  }
}