import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-deletemodal',
  imports: [CommonModule],
  templateUrl: './deletemodal.html',
  styleUrl: './deletemodal.css',
})
export class Deletemodal {
  @Input() isVisible = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
