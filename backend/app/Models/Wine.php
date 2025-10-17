<?php
namespace App\Models;
use App\Core\Database;
use PDO;

class Wine
{
    public $id, $name, $winemaker, $cuvee, $vintage, $visible_vintages, $grapes, $region, $type,
    $price, $promo_price, $stock, $image_url, $description, $visible, $in_store_only;

    public function __construct($data = [])
    {
        $this->visible = isset($data['visible']) ? (int) $data['visible'] : 1;
        $this->in_store_only = isset($data['in_store_only']) ? (int) $data['in_store_only'] : 0;

        foreach ($data as $k => $v) {
            if (property_exists($this, $k))
                $this->$k = $v;
        }
    }

    public static function getAll()
    {
        $db = Database::getInstance();
        $stmt = $db->query("SELECT * FROM wines ORDER BY created_at DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function save()
    {
        $db = Database::getInstance();
        $stmt = $db->prepare("INSERT INTO wines 
            (name, winemaker, cuvee, vintage, visible_vintages, grapes, region, type, price, promo_price, stock, image_url, description, visible, in_store_only) 
            VALUES (:name, :winemaker, :cuvee, :vintage, :visible_vintages, :grapes, :region, :type, :price, :promo_price, :stock, :image_url, :description, :visible, :in_store_only)");
        $stmt->execute([
            ':name' => $this->name,
            ':winemaker' => $this->winemaker,
            ':cuvee' => $this->cuvee,
            ':vintage' => $this->vintage,
            ':visible_vintages' => $this->visible_vintages,
            ':grapes' => $this->grapes,
            ':region' => $this->region,
            ':type' => $this->type,
            ':price' => $this->price,
            ':promo_price' => $this->promo_price,
            ':stock' => $this->stock,
            ':image_url' => $this->image_url,
            ':description' => $this->description,
            ':visible' => $this->visible,
            ':in_store_only' => $this->in_store_only,
        ]);
    }

    public function update()
    {
        $db = Database::getInstance();
        $stmt = $db->prepare("UPDATE wines SET 
            name=:name, winemaker=:winemaker, cuvee=:cuvee, vintage=:vintage, visible_vintages=:visible_vintages,
            grapes=:grapes, region=:region, type=:type, price=:price, promo_price=:promo_price, stock=:stock,
            image_url=:image_url, description=:description, visible=:visible, in_store_only=:in_store_only
            WHERE id=:id");
        $stmt->execute([
            ':id' => $this->id,
            ':name' => $this->name,
            ':winemaker' => $this->winemaker,
            ':cuvee' => $this->cuvee,
            ':vintage' => $this->vintage,
            ':visible_vintages' => $this->visible_vintages,
            ':grapes' => $this->grapes,
            ':region' => $this->region,
            ':type' => $this->type,
            ':price' => $this->price,
            ':promo_price' => $this->promo_price,
            ':stock' => $this->stock,
            ':image_url' => $this->image_url,
            ':description' => $this->description,
            ':visible' => $this->visible,
            ':in_store_only' => $this->in_store_only,
        ]);
    }

    public static function deleteById($id)
    {
        $db = Database::getInstance();
        $stmt = $db->prepare("DELETE FROM wines WHERE id=:id");
        $stmt->execute([':id' => $id]);
    }
}
