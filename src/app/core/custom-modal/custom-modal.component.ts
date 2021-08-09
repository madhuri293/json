import { Component, OnInit} from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html'
})
export class CustomModalComponent implements OnInit {

  public active = false;
  public body: string;
  public title: string;
  public onClose: Subject<boolean>;
  public constructor(
    private readonly _bsModalRef: BsModalRef
  ) { }

  public ngOnInit(): void {
    this.onClose = new Subject();
  }

  public showConfirmationModal(title: string, body: string): void {
    this.title = title;
    this.body = body;
    this.active = true;
  }

  public onConfirm(): void {
    this.active = false;
    this.onClose.next(true);
    this._bsModalRef.hide();
  }

  public onCancel(): void {
    this.closeModal();
  }

  public hideConfirmationModal(): void {
    this.closeModal();
  }

  private closeModal() {
    this.active = false;
    this.onClose.next(false);
    this._bsModalRef.hide();
  }


}
