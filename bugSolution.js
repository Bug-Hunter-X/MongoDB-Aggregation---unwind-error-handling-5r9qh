```javascript
// Solution using $ifNull
db.users.aggregate([
  {
    $lookup: {
      from: 'products',
      localField: 'productIds',
      foreignField: '_id',
      as: 'purchasedProducts'
    }
  },
  {
    $unwind: {
      path: '$purchasedProducts',
      preserveNullAndEmptyArrays: true
    }
  },  
  {
    $group: {
      _id: '$userId',
      totalSpent: {
        $sum: {
          $ifNull: ['$purchasedProducts.price', 0] // Handle null or undefined prices
        }
      }
    }
  }
]);


//Alternative solution using $addFields and $cond for more complex scenarios:

db.users.aggregate([
  {
    $lookup: {
      from: 'products',
      localField: 'productIds',
      foreignField: '_id',
      as: 'purchasedProducts'
    }
  },
  {
    $addFields: {
      purchasedProducts: {
        $cond: {
          if: { $isArray: '$purchasedProducts' },
          then: '$purchasedProducts',
          else: [] // if no products, handle as empty array
        }
      }
    }
  },
  {
    $unwind: '$purchasedProducts'
  },
  {
    $group: {
      _id: '$userId',
      totalSpent: {
        $sum: '$purchasedProducts.price'
      }
    }
  }
]);
```