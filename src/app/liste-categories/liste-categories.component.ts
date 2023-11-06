import { Component, OnInit } from '@angular/core';
import { ProduitService } from '../produit.service';
import { Categorie } from '../model/categorie.model';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-liste-categories',
  templateUrl: './liste-categories.component.html',
  styleUrls: ['./liste-categories.component.css']
})



export class ListeCategoriesComponent implements OnInit {

  categories! : Categorie[];
  ajout:boolean=true;

  updatedCat:Categorie = {"idCat":0,"nomCat":""};

  constructor(private produitService : ProduitService) {}

  ngOnInit(): void {
    this.chargerCategories();
  }

  chargerCategories()
    {
      this.produitService.listeCategories().
      subscribe(cats => {this.categories = cats;
      console.log(cats);
      });
    }

  categorieUpdated(cat: Categorie){
    console.log("Cat updated event",cat);
    this.produitService.ajouterCategorie(cat).
     subscribe( ()=> this.chargerCategories());
   
     Swal.fire({
      icon: 'success',
      title: 'Categorie modifié avec succès',
      showConfirmButton: false,
      timer: 1500 // Auto-close the alert after 1.5 seconds
    });
  

  }

  supprimerCategorie(cat: Categorie) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Êtes-vous sûr de vouloir supprimer cette catégorie ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {
        this.produitService.supprimerCategorie(cat.idCat).subscribe(() => {
          console.log('Catégorie supprimée');
          this.chargerCategories();
        });
      }
    });
  }


  updateCat(cat:Categorie) {
     this.updatedCat=cat;
     this.ajout=false;
  }



}
