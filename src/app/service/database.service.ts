import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(public fireservices: AngularFirestore) { }

  addUsers(data) {
    return this.fireservices.collection('users').add(data);
  }

  getAllUsers() {
    return this.fireservices.collection('users').snapshotChanges();
  }

  editUsers(userId, data) {
    return this.fireservices.doc('users/'+userId).update(data);
  }

  deleteUsers(userId) {
    return this.fireservices.doc('users/'+userId).delete();
  }

}
