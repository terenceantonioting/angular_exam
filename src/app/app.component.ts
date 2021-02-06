import { Component } from '@angular/core';
import { DatabaseService } from './service/database.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

declare const $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'exam';

  users: any;
  userId: string;
  userName: string;
  userEmail: string;
  userAge: number;
  userContact: number;
  userAddress: string;

  submitForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    age: new FormControl('', [Validators.required, Validators.min(18), Validators.max(65)]),
    contact: new FormControl('', [Validators.required, Validators.pattern(("^((\\+91-?)|0)?[0-9]{10}$"))]),
    address: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
  })

  get name() { return this.submitForm.get('name')}
  get email() { return this.submitForm.get('email')}
  get age() { return this.submitForm.get('age')}
  get contact() { return this.submitForm.get('contact')}
  get address() { return this.submitForm.get('address')}

  constructor(public DatabaseService: DatabaseService) {

  }

  ngOnInit() {

    this.DatabaseService.getAllUsers().subscribe(data => {
      this.users = data.map(x => {
        return {
          id: x.payload.doc.id,
          name: x.payload.doc.data()['name'],
          email: x.payload.doc.data()['email'],
          age: x.payload.doc.data()['age'],
          contact: x.payload.doc.data()['contact'],
          address: x.payload.doc.data()['address']
        }
      })
      console.log(this.users);
    })

  }

  async submitHandler() {

    const formValue = this.submitForm.value;

    await this.DatabaseService.addUsers(formValue).then(res => {

      this.submitForm.reset();

      $('#addUser').modal('hide');

      Swal.fire(
        'Success!',
        'User has been added!',
        'success'
      )

    }).catch(err => {

      $('#addUser').modal('hide');

      Swal.fire(
        'Oops...',
        'Something went wrong!',
        'error'
      )

    })

  }

  editUser(userId, data) {

    $('#editUser').modal('show');

    this.userId = userId;

    this.submitForm = new FormGroup({
      name: new FormControl(data.name, Validators.required),
      email: new FormControl(data.email, [Validators.required, Validators.email]),
      age: new FormControl(data.age, [Validators.required, Validators.min(18), Validators.max(65)]),
      contact: new FormControl(data.contact, [Validators.required, Validators.pattern(("^((\\+91-?)|0)?[0-9]{10}$"))]),
      address: new FormControl(data.address, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
    })

  }

  async updateUser() {

    // let updatedUser = {};

    // updatedUser['name'] = (<HTMLInputElement>document.getElementById('floatingEditName')).value;
    // updatedUser['email'] = (<HTMLInputElement>document.getElementById('floatingEditEmail')).value;
    // updatedUser['age'] = (<HTMLInputElement>document.getElementById('floatingEditAge')).value;
    // updatedUser['contact'] = (<HTMLInputElement>document.getElementById('floatingEditContact')).value;
    // updatedUser['address'] = (<HTMLInputElement>document.getElementById('floatingEditAddress')).value;

    const formValue = this.submitForm.value;

    await this.DatabaseService.editUsers(this.userId, formValue).then(res => {

      $('#editUser').modal('hide');

      this.submitForm.reset();

      Swal.fire(
        'Success!',
        'User Information has been updated!',
        'success'
      )

    }).catch(err => {

      $('#editUser').modal('hide');

      this.submitForm.reset();

      Swal.fire(
        'Oops...',
        'Something went wrong!',
        'error'
      )

    });

  }

  deleteUser(userId) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.DatabaseService.deleteUsers(userId);
        Swal.fire(
          'Deleted!',
          'User has been deleted.',
          'success'
        )
      }
    })
  }

  clearFields() {

    this.submitForm.reset();

  }

}
