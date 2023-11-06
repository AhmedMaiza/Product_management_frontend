import { Injectable } from '@angular/core';
import { Produit } from './model/produit.model';
import { Categorie } from './model/categorie.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiURL } from './config';
import { Image } from './model/image.model';

const httpOptions = { headers: new HttpHeaders( {'Content-Type': 'application/json'} ) };

@Injectable({
  providedIn: 'root'
})

export class ProduitService {


  //apiURLCat: string = 'http://localhost:8080/produits/cat'; pour spring REST
  produits: Produit[]; //un tableau de Produit
  produit!: Produit;
  //categories: Categorie[];

  constructor(private http : HttpClient) {

    
  }

  listeProduit(): Observable<Produit[]> { 
    return this.http.get<Produit[]>(apiURL);
  }


  ajouterProduit( prod: Produit):Observable<Produit>{
    return this.http.post<Produit>(apiURL, prod, httpOptions); 
  }

  supprimerProduit(id : number) { 
    const url = `${apiURL}/${id}`;
    return this.http.delete(url, httpOptions);
  }

  consulterProduit(id: number): Observable<Produit> {
     const url = `${apiURL}/${id}`;
     return this.http.get<Produit>(url);
  }

  updateProduit(prod :Produit) : Observable<Produit> 
  {
    return this.http.put<Produit>(apiURL, prod ,httpOptions);
  }

  trierProduits() {
    this.produits = this.produits.sort((n1, n2) => {
      if (n1.idProduit! > n2.idProduit!) {
        return 1;
      } if (n1.idProduit! < n2.idProduit!) {
        return -1;
      }
      return 0;
    });
  }

  listeCategories():Observable<Categorie[]>{
     return this.http.get<Categorie[]>(apiURL+"/cat");
   }  

   rechercherParCategorie(idCat: number):Observable< Produit[]> { 
    const url = `${apiURL}/prodscat/${idCat}`;
    return this.http.get<Produit[]>(url);
  }

  rechercherParNom(nom: string):Observable< Produit[]> {
    const url = `${apiURL}/prodsByName/${nom}`;
    return this.http.get<Produit[]>(url);
  }

  ajouterCategorie(cat: Categorie):Observable<Categorie>{
     return this.http.post<Categorie>(apiURL+"/cat", cat, httpOptions);
  }

  uploadImage(file: File, filename: string): Observable<Image>{
     const imageFormData = new FormData();
     imageFormData.append('image', file, filename);
     const url = `${apiURL + '/image/upload'}`; 
     return this.http.post<Image>(url, imageFormData);
    }
   
  loadImage(id: number): Observable<Image> {
      const url = `${apiURL + '/image/get/info'}/${id}`;
      return this.http.get<Image>(url);
    }
  
  supprimerCategorie(id : number) { 
      const url = `${apiURL+"/cat"}/${id}`;
      return this.http.delete(url, httpOptions);
    }


   /*listeCategories():Observable<CategorieWrapper>
    {
      return this.http.get<CategorieWrapper>(this.apiURLCat);
    }  pour SPRING REST 


   consulterCategorie(id: number): Categorie 
   { 
      return this.categories.find(cat => cat.idCat == id)!;
   } on mieux utiliser dans une function dans update produit*/
 


} 
