import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective {
  private isDragging = false;
  private offsetX = 0;
  private offsetY = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    const native = this.el.nativeElement;
    this.renderer.setStyle(native, 'position', 'fixed');  // keeps it floating above content
    this.renderer.setStyle(native, 'cursor', 'move');     // show move cursor
    this.renderer.setStyle(native, 'z-index', '9999');    // stay above everything
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    event.preventDefault(); // stop text selection
    this.isDragging = true;
    this.offsetX = this.el.nativeElement.offsetLeft - event.clientX;
    this.offsetY = this.el.nativeElement.offsetTop - event.clientY;

    // Disable text selection globally while dragging
    this.renderer.setStyle(document.body, 'user-select', 'none');
  }

  @HostListener('mouseup')
  onMouseUp() {
    this.isDragging = false;
    // Restore text selection
    this.renderer.removeStyle(document.body, 'user-select');
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      this.el.nativeElement.style.left = event.clientX + this.offsetX + 'px';
      this.el.nativeElement.style.top = event.clientY + this.offsetY + 'px';
    }
  }
}
