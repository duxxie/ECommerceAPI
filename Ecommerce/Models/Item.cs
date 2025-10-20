namespace Models.Item;

public class Item
{
    public Guid Id { get; set; }
    public string Nome { get; set; }
    public string Descricao { get; set; }
    public decimal Preco { get; set; }
    public int Estoque { get; set; }
    public string Categoria { get; set; }
    public bool Ativo { get; set; }
}