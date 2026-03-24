import { Component, output, signal, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UserService, UpdateProfileDTO } from '@services/user';
import { AuthService, ChangePasswordDTO } from '@services/auth';
import { ToastService } from '@services/toast';
import { firstValueFrom } from 'rxjs';
import { NgStyle } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { heroKey } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  imports: [FormsModule, TranslatePipe, NgStyle, NgIcon],
  templateUrl: './settings-modal.html',
  styleUrls: ['./settings-modal.scss']
})
export class SettingsModalComponent {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private translate = inject(TranslateService);

  isOpen = signal(false);
  activeTab: 'perfil' | 'privacidade' | 'conta' = 'perfil';
  dirty = signal(false);
  close = output<void>();

  selectedAvatarType: 'gradient' | 'avatar' = 'gradient';
  originalAvatarUrl: string | null = null;
  originalGradientIndex: number = 0;

  public readonly heroKey = heroKey;

  user = {
    username: '',
    email: '',
    avatarGradientIndex: 0
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
  showEditPassword = signal(false);
  showDeleteConfirm = signal(false);

  editUsernameValue = '';
  editPasswordData = { current: '', new: '', confirm: '' };

  savingProfile = signal(false);
  changingPassword = signal(false);
  deletingAccount = signal(false);

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        const profile = this.userService.user();
        if (profile) {
          this.user.username = profile.username;
          this.user.email = profile.email;

          this.originalAvatarUrl = profile.avatarUrl || null;
          const gradientIndex = this.gradients.findIndex(g => g === profile.gradientAvatar);
          this.originalGradientIndex = gradientIndex >= 0 ? gradientIndex : 0;

          if (profile.avatarUrl) {
            this.selectedAvatarType = 'avatar';
            this.user.avatarGradientIndex = this.originalGradientIndex;
          } else {
            this.selectedAvatarType = 'gradient';
            this.user.avatarGradientIndex = this.originalGradientIndex;
          }
        }
        this.dirty.set(false);
      }
    });
  }

  open() {
    this.isOpen.set(true);
    this.activeTab = 'perfil';
    this.showEditUsername.set(false);
    this.showEditPassword.set(false);
    this.showDeleteConfirm.set(false);
  }

  closeModal() {
    this.isOpen.set(false);
    this.close.emit();
  }

  getAvatarPreviewStyle(): Record<string, string> {
    if (this.selectedAvatarType === 'avatar' && this.originalAvatarUrl) {
      return {
        'background': `url(${this.originalAvatarUrl}) center / cover no-repeat`,
      };
    }
    return {
      'background': this.gradients[this.user.avatarGradientIndex],
    };
  }

  setActiveTab(tab: 'perfil' | 'privacidade' | 'conta') {
    this.activeTab = tab;
  }

  markDirty() {
    this.dirty.set(true);
  }

  async save() {
    const profile = this.userService.user();
    if (!profile) return;

    const dto: UpdateProfileDTO = {
      username: this.user.username,
      gradientAvatar: null,
      avatarUrl: null,
    };

    if (this.selectedAvatarType === 'avatar' && this.originalAvatarUrl) {
      dto.avatarUrl = this.originalAvatarUrl;
    } else {
      dto.gradientAvatar = this.gradients[this.user.avatarGradientIndex];
    }

    this.savingProfile.set(true);
    try {
      await firstValueFrom(this.userService.updateProfile(dto));
      this.toast.show(
        'success',
        this.translate.instant('SETTINGS.TOAST.PROFILE_UPDATED_TITLE'),
        this.translate.instant('SETTINGS.TOAST.PROFILE_UPDATED_DESC')
      );
      this.dirty.set(false);
    } catch (error) {
      console.error(error);
      this.toast.show(
        'error',
        this.translate.instant('SETTINGS.TOAST.PROFILE_UPDATE_ERROR_TITLE'),
        this.translate.instant('SETTINGS.TOAST.PROFILE_UPDATE_ERROR_DESC')
      );
    } finally {
      this.savingProfile.set(false);
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  resetToAvatar() {
    if (this.originalAvatarUrl) {
      this.selectedAvatarType = 'avatar';
      this.markDirty();
    }
  }

  pickGradient(index: number) {
    this.user.avatarGradientIndex = index;
    this.selectedAvatarType = 'gradient';
    this.markDirty();
  }

  openEditUsername() {
    this.editUsernameValue = this.user.username;
    this.showEditUsername.set(true);
  }

  async saveUsername() {
    if (!this.editUsernameValue.trim()) return;
    this.user.username = this.editUsernameValue.trim();
    this.markDirty();
    this.showEditUsername.set(false);
  }

  openEditPassword() {
    this.editPasswordData = { current: '', new: '', confirm: '' };
    this.showEditPassword.set(true);
  }

  async savePassword() {
    const { current, new: newPass, confirm } = this.editPasswordData;
    if (newPass !== confirm) {
      this.toast.show(
        'error',
        this.translate.instant('SETTINGS.TOAST.PASSWORD_MISMATCH_TITLE'),
        this.translate.instant('SETTINGS.TOAST.PASSWORD_MISMATCH_DESC')
      );
      return;
    }
    if (newPass.length < 6) {
      this.toast.show(
        'error',
        this.translate.instant('SETTINGS.TOAST.PASSWORD_TOO_SHORT_TITLE'),
        this.translate.instant('SETTINGS.TOAST.PASSWORD_TOO_SHORT_DESC')
      );
      return;
    }

    const dto: ChangePasswordDTO = { currentPassword: current, newPassword: newPass };
    this.changingPassword.set(true);
    try {
      await firstValueFrom(this.authService.changePassword(dto));
      this.toast.show(
        'success',
        this.translate.instant('SETTINGS.TOAST.PASSWORD_CHANGED_TITLE'),
        this.translate.instant('SETTINGS.TOAST.PASSWORD_CHANGED_DESC')
      );
      this.showEditPassword.set(false);
    } catch (error) {
      console.error(error);
      this.toast.show(
        'error',
        this.translate.instant('SETTINGS.TOAST.PASSWORD_CHANGE_ERROR_TITLE'),
        this.translate.instant('SETTINGS.TOAST.PASSWORD_CHANGE_ERROR_DESC')
      );
    } finally {
      this.changingPassword.set(false);
    }
  }

  openDeleteConfirm() {
    this.showDeleteConfirm.set(true);
  }

  async confirmDelete() {
    this.deletingAccount.set(true);
    try {
      await firstValueFrom(this.userService.deleteAccount());
      this.authService.logout(); // faz logout e redireciona
      this.toast.show(
        'success',
        this.translate.instant('SETTINGS.TOAST.ACCOUNT_DELETED_TITLE'),
        this.translate.instant('SETTINGS.TOAST.ACCOUNT_DELETED_DESC')
      );
      this.showDeleteConfirm.set(false);
      this.closeModal();
    } catch (error) {
      console.error(error);
      this.toast.show(
        'error',
        this.translate.instant('SETTINGS.TOAST.ACCOUNT_DELETE_ERROR_TITLE'),
        this.translate.instant('SETTINGS.TOAST.ACCOUNT_DELETE_ERROR_DESC')
      );
    } finally {
      this.deletingAccount.set(false);
    }
  }

  cancelSubModal() {
    this.showEditUsername.set(false);
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