export class Product {

  constructor(public id:string,
              public sku :string,
              public name : string,
              public description : string,
              public unit_price : number,
              public image_url : string,
              public active : boolean,
              public unitsInstock : number,
              public dateCreated : Date,
              public last_updated : Date) {
  }
}
