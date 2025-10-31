namespace Ecommerce.Models;

public class Carrinho
{
    public int Id { get; set; }
    public int ClienteId { get; set; }

    //Relacionamentos
    public List<ItemCarrinho> Itens { get; set; } = new();
    public Cliente? Cliente { get; set; }
}
