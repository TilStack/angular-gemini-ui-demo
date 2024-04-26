import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, computed, inject, input } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './user-details.template.html',
  styleUrl: './user-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsComponent  {

  private userService = inject(UserService)
  // ngOnChanges(changes: SimpleChanges): void {
  //   if(changes['userId']){
  //     this.user = this.userService.get(this.userId)
  //   }
  // } 
  // @Input() set userId(userId: number | null){
  //   this.user = this.userService.get(userId)
  // }

  user = input.required<User | null, number | null>({
    alias: "id",
    transform: (userId: number | null) => this.userService.get(userId)
  })

  //user = computed<User | null>(() => this.userService.get(this.userId()))

}
