Feature: Shopping cart and checkout

  Background:
    Given I am logged in as a standard user

  @smoke
  Scenario: Add products to the cart
    When I add "Sauce Labs Backpack" to the cart
    And I add "Sauce Labs Bike Light" to the cart
    Then the cart badge should show "2"

  @smoke
  Scenario: Complete a purchase
    When I add "Sauce Labs Backpack" to the cart
    And I go to the cart
    And I proceed to checkout
    And I enter checkout details:
      | firstName | lastName | postalCode |
      | Madhu     | K        | 560001     |
    Then the order total should contain "$32.39"
    When I finish the order
    Then I should see "Thank you for your order!"