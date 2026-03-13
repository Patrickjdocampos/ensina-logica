from legacy.cli_v1.explicacoes import (
    explicar_if,
    explicar_if_else,
    explicar_for,
    explicar_while
)

def exibir_menu() -> None:
    print('\n * Ensina Logica *')
    print("1 - Exemplo com if")
    print("2 - Exemplo com if/else")
    print("3 - Exemplo com for")
    print("4 - Exemplo com while")
    print("0 - Sair")

def main() -> None:
    while True:
        exibir_menu()
        opcao = input('Escolha uma opção: ').strip()

        if opcao == "1":
            explicar_if()
        elif opcao == "2":
            explicar_if_else()
        elif opcao == "3":
            explicar_for()
        elif opcao == "4":
            explicar_while()
        elif opcao == "0":
            print("Encerrando o Ensina Logica.")
            break
        else:
            print("Opção inválida. Tente novamente.")

if __name__ == '__main__':
    main()